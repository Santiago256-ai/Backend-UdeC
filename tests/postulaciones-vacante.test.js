// Contención 2 (2026-10): GET /api/postulaciones/vacante/:vacanteId sólo para la
// empresa dueña de la vacante (también si está eliminada, la usa
// VacantesEliminadas). Ajena o inexistente: el mismo 404. Devuelve sólo lo que
// leen la tabla de postulantes, el chat y VerCV. Prisma está simulado.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import {
  proyectar, PROHIBIDOS, sinCampos, postulacionCompleta,
  EMPRESA_DUENA, OTRA_EMPRESA, EGRESADO_MISMO_ID,
} from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  vacante: { findUnique: vi.fn() },
  postulacion: { findMany: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => ({ enviarCorreoCambioEstado: vi.fn() }));

const { default: postulacionesRoutes } = await import('../src/routes/postulacionesRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/postulaciones', postulacionesRoutes);

const VACANTES = {
  5: { id: 5, empresaId: 3, estado: 'ABIERTA', titulo: 'Analista' },
  6: { id: 6, empresaId: 3, estado: 'ELIMINADA', titulo: 'Auxiliar' },
  8: { id: 8, empresaId: 4, estado: 'ABIERTA', titulo: 'Contador' },
};

beforeEach(() => {
  vi.clearAllMocks();
  db.vacante.findUnique.mockImplementation(async ({ where, select }) => {
    const v = VACANTES[where.id];
    return v ? proyectar(v, { select }) : null;
  });
  db.postulacion.findMany.mockImplementation(async (args) =>
    proyectar([postulacionCompleta({ vacanteId: args.where.vacanteId })], args));
});

const pedir = (id, token) => {
  const peticion = request(app).get(`/api/postulaciones/vacante/${id}`);
  return token ? peticion.set('Authorization', token()) : peticion;
};

describe('GET /api/postulaciones/vacante/:vacanteId (acceso)', () => {
  it('sin token responde 403 (lo que ya devuelve authMiddleware) y no consulta', async () => {
    const res = await pedir(5);
    expect(res.status).toBe(403);
    expect(db.postulacion.findMany).not.toHaveBeenCalled();
  });

  it('con token de egresado responde 403 y no consulta', async () => {
    const res = await pedir(5, EGRESADO_MISMO_ID);
    expect(res.status).toBe(403);
    expect(db.postulacion.findMany).not.toHaveBeenCalled();
  });

  it('otra empresa recibe el mismo 404 que una vacante inexistente', async () => {
    const ajena = await pedir(5, OTRA_EMPRESA);
    const inexistente = await pedir(999, EMPRESA_DUENA);
    expect(ajena.status).toBe(404);
    expect(inexistente.status).toBe(404);
    expect(ajena.body).toEqual(inexistente.body);
    expect(db.postulacion.findMany).not.toHaveBeenCalled();
  });

  it('la dueña ve las postulaciones de su vacante', async () => {
    const res = await pedir(5, EMPRESA_DUENA);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('la dueña también ve las de una vacante eliminada (VacantesEliminadas)', async () => {
    const res = await pedir(6, EMPRESA_DUENA);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('GET /api/postulaciones/vacante/:vacanteId (campos)', () => {
  it('sólo lo que leen la tabla y el chat; sin teléfono, notas ni calificación', async () => {
    const res = await pedir(5, EMPRESA_DUENA);
    const p = res.body[0];
    expect(Object.keys(p).sort()).toEqual(['anclado', 'egresado', 'egresadoId', 'estado', 'fecha', 'id', 'vacanteId']);
    expect(sinCampos(p, ['telefono', 'comentarioAdmin', 'calificacionAdmin', 'chatActivo'])).toEqual([]);
  });

  it('del egresado sólo id, nombres, apellidos, correo y la hoja de vida que pinta VerCV', async () => {
    const res = await pedir(5, EMPRESA_DUENA);
    const { egresado } = res.body[0];
    expect(Object.keys(egresado).sort()).toEqual(['apellidos', 'correo', 'cv', 'id', 'nombres']);
    expect(sinCampos(egresado, [...PROHIBIDOS, 'celular'])).toEqual([]);
    expect(Object.keys(egresado.cv).sort()).toEqual([
      'aptitudes', 'celular', 'descripcion', 'direccion', 'educacion', 'experiencia', 'habilidades', 'idiomas', 'referencias',
    ]);
    expect(egresado.cv.educacion[0]).toMatchObject({ titulo: 'Ingeniería de Sistemas', institucion: 'UdeC' });
    expect(egresado.cv.referencias[0]).toMatchObject({ nombre: 'Pedro', cargo: 'Jefe', celular: '3100000000' });
  });
});
