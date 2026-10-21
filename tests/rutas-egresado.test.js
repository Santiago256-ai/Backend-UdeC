// Fase 0 (2026-10): rutas que toman la identidad del egresado del token.
// Estas rutas usan req.user.id como id de egresado. Antes no miraban el rol: una
// empresa (o cualquier sesión) con el mismo id numérico leía y sobrescribía el
// perfil y la hoja de vida de ese egresado, o se postulaba en su nombre.
// POST /api/postulaciones/enviar ni siquiera pedía token: el egresado salía del
// cuerpo de la petición.
// Prisma, Supabase y el correo están simulados: no hay base de datos, red ni envíos.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { firmar, proyectar, EMPRESA_DUENA, EGRESADO_MISMO_ID, PROHIBIDOS, sinCampos, egresadoCompleto } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  egresado: { findUnique: vi.fn(), update: vi.fn() },
  perfilCV: { findUnique: vi.fn(), upsert: vi.fn() },
  vacante: { findUnique: vi.fn() },
  postulacion: { findUnique: vi.fn(), create: vi.fn() },
  notificacion: { create: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => ({ enviarCorreoCambioEstado: vi.fn() }));

const { default: estudianteRoutes } = await import('../src/routes/estudianteRoutes.js');
const { default: postulacionesRoutes } = await import('../src/routes/postulacionesRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/postulaciones', postulacionesRoutes);

const llamadasALaBase = () => Object.values(db)
  .flatMap((modelo) => Object.values(modelo))
  .reduce((total, fn) => total + fn.mock.calls.length, 0);

// Todas toman el egresado del token (id 3 en las pruebas).
const RUTAS = [
  ['get', '/api/estudiantes/perfil'],
  ['put', '/api/estudiantes/actualizar', { nombres: 'Otra' }],
  ['get', '/api/estudiantes/mi-cv'],
  ['post', '/api/estudiantes/guardar-cv', { descripcion: 'Sobrescrita' }],
  ['post', '/api/estudiantes/5/postular', { telefono: '3000000000' }],
  ['post', '/api/postulaciones/enviar', { vacanteId: 5, egresadoId: 3, telefono: '3000000000' }],
];

const llamar = (metodo, ruta, cuerpo, token) => {
  const peticion = request(app)[metodo](ruta);
  if (token) peticion.set('Authorization', token);
  return cuerpo ? peticion.send(cuerpo) : peticion;
};

beforeEach(() => {
  vi.clearAllMocks();
  const egresado = egresadoCompleto(3);
  // Como Prisma: devuelve sólo lo que pide el select (sin select, la fila entera).
  db.egresado.findUnique.mockImplementation(async (consulta) => proyectar(egresado, consulta));
  db.egresado.update.mockImplementation(async ({ data }) => ({ ...egresado, ...data }));
  db.perfilCV.findUnique.mockResolvedValue({ ...egresado.cv, egresadoId: 3 });
  db.perfilCV.upsert.mockResolvedValue({ ...egresado.cv, egresadoId: 3 });
  db.vacante.findUnique.mockResolvedValue({ titulo: 'Analista', estado: 'ABIERTA', empresaId: 4 });
  db.postulacion.findUnique.mockResolvedValue(null);
  db.postulacion.create.mockImplementation(async ({ data }) => ({ id: 11, ...data, egresado: { nombres: 'Laura' } }));
  db.notificacion.create.mockResolvedValue({ id: 1 });
});

describe('una sesión que no es de egresado no entra en las rutas del egresado', () => {
  it.each(RUTAS)('%s %s con token de empresa del mismo id numérico: 403 sin tocar la base', async (metodo, ruta, cuerpo) => {
    const res = await llamar(metodo, ruta, cuerpo, EMPRESA_DUENA());
    expect(res.status).toBe(403);
    expect(llamadasALaBase()).toBe(0);
  });

  // Como el token que firma POST /api/estudiantes/login (pendiente en Contención 3).
  it.each(RUTAS)('%s %s con token sin rol: 403 sin tocar la base', async (metodo, ruta, cuerpo) => {
    const res = await llamar(metodo, ruta, cuerpo, firmar({ id: 3 }));
    expect(res.status).toBe(403);
    expect(llamadasALaBase()).toBe(0);
  });

  it('POST /api/postulaciones/enviar sin token: no crea la postulación', async () => {
    const res = await llamar('post', '/api/postulaciones/enviar', { vacanteId: 5, egresadoId: 3 });
    expect(res.status).toBeGreaterThanOrEqual(401);
    expect(res.status).toBeLessThan(404);
    expect(llamadasALaBase()).toBe(0);
  });
});

describe('el propio egresado sigue usando sus rutas igual', () => {
  it('GET /api/estudiantes/perfil devuelve su perfil sin la contraseña', async () => {
    const res = await llamar('get', '/api/estudiantes/perfil', null, EGRESADO_MISMO_ID());
    expect(res.status).toBe(200);
    expect(db.egresado.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 3 } }));
    expect(res.body).toMatchObject({ id: 3, nombres: 'Laura', apellidos: 'Gómez', celular: '3000000000' });
    expect(res.body).not.toHaveProperty('password');
  });

  it('GET /api/estudiantes/perfil trae lo que lee PerfilEgresado.jsx y ningún secreto', async () => {
    const res = await llamar('get', '/api/estudiantes/perfil', null, EGRESADO_MISMO_ID());
    expect(sinCampos(res.body, PROHIBIDOS)).toEqual([]);
    expect(res.body).toMatchObject({
      nombres: 'Laura', apellidos: 'Gómez', correo: 'laura@ejemplo.com', celular: '3000000000',
      facultad: 'Ingeniería', programa: 'Sistemas',
    });
  });

  it('PUT /api/estudiantes/actualizar guarda sobre su propio registro', async () => {
    const res = await llamar('put', '/api/estudiantes/actualizar', { nombres: 'Lau' }, EGRESADO_MISMO_ID());
    expect(res.status).toBe(200);
    expect(db.egresado.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 3 } }));
    expect(res.body.egresado).toMatchObject({ id: 3, nombres: 'Lau' });
    expect(res.body.egresado).not.toHaveProperty('password');
  });

  it('GET /api/estudiantes/mi-cv lee su propia hoja de vida', async () => {
    const res = await llamar('get', '/api/estudiantes/mi-cv', null, EGRESADO_MISMO_ID());
    expect(res.status).toBe(200);
    expect(db.perfilCV.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { egresadoId: 3 } }));
    expect(res.body.egresadoId).toBe(3);
  });

  it('POST /api/estudiantes/guardar-cv guarda su propia hoja de vida', async () => {
    const res = await llamar('post', '/api/estudiantes/guardar-cv', { descripcion: 'Nueva' }, EGRESADO_MISMO_ID());
    expect(res.status).toBe(200);
    expect(db.perfilCV.upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { egresadoId: 3 } }));
  });

  it('POST /api/estudiantes/:vacanteId/postular lo postula a él', async () => {
    const res = await llamar('post', '/api/estudiantes/5/postular', { telefono: '3000000000' }, EGRESADO_MISMO_ID());
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('¡Postulación exitosa!');
    expect(db.postulacion.create.mock.calls[0][0].data).toMatchObject({ vacanteId: 5, egresadoId: 3 });
  });

  it('POST /api/postulaciones/enviar lo postula a él aunque el cuerpo traiga otro egresadoId', async () => {
    const res = await llamar('post', '/api/postulaciones/enviar',
      { vacanteId: 5, egresadoId: 9, telefono: '3000000000' }, EGRESADO_MISMO_ID());
    expect(res.status).toBe(201);
    expect(db.postulacion.create.mock.calls[0][0].data).toMatchObject({ vacanteId: 5, egresadoId: 3 });
    expect(db.notificacion.create.mock.calls[0][0].data).toMatchObject({ egresadoId: 3 });
    expect(sinCampos(res.body, PROHIBIDOS)).toEqual([]);
  });
});
