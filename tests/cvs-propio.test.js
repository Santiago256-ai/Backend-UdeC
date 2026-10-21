// Fase 0 (2026-10): hoja de vida por /api/cvs/:egresadoId.
// GET y POST no pedían token: cualquiera leía o sobrescribía la hoja de vida de
// cualquier egresado cambiando el número de la URL. Ahora sólo el propio
// egresado; el CV de otro responde lo mismo que un CV que no existe.
// La empresa ve las hojas de vida por /api/postulaciones/vacante/:id.
// Prisma está simulado: no hay base de datos ni red.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { firmar, EMPRESA_DUENA, EGRESADO_MISMO_ID, egresadoCompleto } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  perfilCV: { findUnique: vi.fn(), upsert: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));

const { default: cvsRoutes } = await import('../src/routes/cvsRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/cvs', cvsRoutes);

const llamadasALaBase = () => Object.values(db)
  .flatMap((modelo) => Object.values(modelo))
  .reduce((total, fn) => total + fn.mock.calls.length, 0);

const CV_NO_ENCONTRADO = { message: 'CV no encontrado' };
const OTRO_EGRESADO = () => firmar({ id: 8, rol: 'egresado' });
// Lo que envía CrearCV.jsx al guardar
const CUERPO = {
  celular: '3000000000', direccion: 'Calle 1', descripcion: 'Perfil',
  habilidades: [{ nombre: 'Excel', nivel: 3 }],
  experiencia: [{ cargo: 'Practicante', empresa: 'Agro Andes', periodo: '2025' }],
  educacion: [], referencias: [], aptitudes: [], idiomas: [],
};

const METODOS = [
  ['get', null],
  ['post', CUERPO],
];

const llamar = (metodo, id, cuerpo, token) => {
  const peticion = request(app)[metodo](`/api/cvs/${id}`);
  if (token) peticion.set('Authorization', token);
  return cuerpo ? peticion.send(cuerpo) : peticion;
};

beforeEach(() => {
  vi.clearAllMocks();
  db.perfilCV.findUnique.mockResolvedValue({ ...egresadoCompleto(3).cv, egresadoId: 3 });
  db.perfilCV.upsert.mockImplementation(async ({ where }) => ({ id: 1, ...where }));
});

describe('/api/cvs/:egresadoId — quien no es el egresado no llega a la base', () => {
  it.each(METODOS)('%s sin token: 403', async (metodo, cuerpo) => {
    const res = await llamar(metodo, 3, cuerpo);
    expect(res.status).toBe(403);
    expect(llamadasALaBase()).toBe(0);
  });

  it.each(METODOS)('%s con token de empresa del mismo id numérico: 403', async (metodo, cuerpo) => {
    const res = await llamar(metodo, 3, cuerpo, EMPRESA_DUENA());
    expect(res.status).toBe(403);
    expect(llamadasALaBase()).toBe(0);
  });

  it.each(METODOS)('%s con token de otro egresado: el mismo 404 que un CV que no existe', async (metodo, cuerpo) => {
    const res = await llamar(metodo, 3, cuerpo, OTRO_EGRESADO());
    expect(res.status).toBe(404);
    expect(res.body).toEqual(CV_NO_ENCONTRADO);
    expect(llamadasALaBase()).toBe(0);
  });
});

describe('/api/cvs/:egresadoId — el propio egresado sigue igual', () => {
  it('GET devuelve su hoja de vida', async () => {
    const res = await llamar('get', 3, null, EGRESADO_MISMO_ID());
    expect(res.status).toBe(200);
    expect(db.perfilCV.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { egresadoId: 3 } }));
    expect(res.body).toMatchObject({ egresadoId: 3, descripcion: 'Perfil' });
  });

  it('GET sin hoja de vida todavía: 404 "CV no encontrado"', async () => {
    db.perfilCV.findUnique.mockResolvedValue(null);
    const res = await llamar('get', 3, null, EGRESADO_MISMO_ID());
    expect(res.status).toBe(404);
    expect(res.body).toEqual(CV_NO_ENCONTRADO);
  });

  it('POST guarda su hoja de vida', async () => {
    const res = await llamar('post', 3, CUERPO, EGRESADO_MISMO_ID());
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('CV guardado correctamente');
    const { where, create } = db.perfilCV.upsert.mock.calls[0][0];
    expect(where).toEqual({ egresadoId: 3 });
    expect(create).toMatchObject({ egresadoId: 3, descripcion: 'Perfil' });
  });
});
