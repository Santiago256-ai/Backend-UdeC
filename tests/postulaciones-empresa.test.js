// Contención 2 (2026-10): GET /api/postulaciones/empresa/:empresaId sólo para la
// propia empresa. Devuelve lo que lee TotalPostulaciones, que sí muestra y edita
// calificacionAdmin y comentarioAdmin. Prisma está simulado.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import {
  proyectar, sinCampos, postulacionCompleta, EMPRESA_DUENA, OTRA_EMPRESA, EGRESADO_MISMO_ID,
} from './apoyo/simulador.js';

const db = vi.hoisted(() => ({ postulacion: { findMany: vi.fn() } }));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => ({ enviarCorreoCambioEstado: vi.fn() }));

const { default: postulacionesRoutes } = await import('../src/routes/postulacionesRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/postulaciones', postulacionesRoutes);

beforeEach(() => {
  vi.clearAllMocks();
  db.postulacion.findMany.mockImplementation(async (args) => proyectar([postulacionCompleta()], args));
});

const pedir = (empresaId, token) => {
  const peticion = request(app).get(`/api/postulaciones/empresa/${empresaId}`);
  return token ? peticion.set('Authorization', token()) : peticion;
};

describe('GET /api/postulaciones/empresa/:empresaId', () => {
  it('sin token responde 403 (lo que ya devuelve authMiddleware) y no consulta', async () => {
    const res = await pedir(3);
    expect(res.status).toBe(403);
    expect(db.postulacion.findMany).not.toHaveBeenCalled();
  });

  it('con token de egresado (mismo id numérico) responde 403 y no consulta', async () => {
    const res = await pedir(3, EGRESADO_MISMO_ID);
    expect(res.status).toBe(403);
    expect(db.postulacion.findMany).not.toHaveBeenCalled();
  });

  it('otra empresa recibe 404 y no consulta', async () => {
    const res = await pedir(3, OTRA_EMPRESA);
    expect(res.status).toBe(404);
    expect(db.postulacion.findMany).not.toHaveBeenCalled();
  });

  it('la propia empresa recibe sólo lo que lee TotalPostulaciones', async () => {
    const res = await pedir(3, EMPRESA_DUENA);
    expect(res.status).toBe(200);
    const p = res.body[0];
    expect(Object.keys(p).sort()).toEqual([
      'calificacionAdmin', 'comentarioAdmin', 'egresado', 'estado', 'fecha', 'fechaActualizacion', 'id', 'vacante',
    ]);
    expect(Object.keys(p.egresado).sort()).toEqual(['apellidos', 'nombres']);
    expect(Object.keys(p.vacante)).toEqual(['titulo']);
    expect(sinCampos(p, ['telefono', 'chatActivo'])).toEqual([]);
  });
});
