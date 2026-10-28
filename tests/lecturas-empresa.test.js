// Ronda "dueño", entrega 2 (2026-10): lecturas de la empresa con datos personales.
// GET /api/vacantes/empresa/:id/metricas-pro y GET /api/notificaciones/empresa/:empresaId
// exigen sesión de empresa y sólo responden a la propia empresa. Se comprueban el
// rol Y el id (los ids se repiten entre egresados, empresas y administradores).
// Otra empresa, una inexistente o un id que no es número: el mismo 404, sin consultar.
// Devuelven sólo lo que lee el frontend: nunca la fila completa de la postulación.
// Prisma, Supabase y el correo están simulados: no hay base de datos, red ni envíos.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import {
  proyectar, postulacionCompleta, notificacionEmpresaCompleta,
  EMPRESA_DUENA, OTRA_EMPRESA, EGRESADO_MISMO_ID, firmarAdmin,
} from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  vacante: { findMany: vi.fn() },
  postulacion: { findMany: vi.fn() },
  notificacion: { findMany: vi.fn() },
  administrador: { findUnique: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => ({ enviarCorreoCambioEstado: vi.fn() }));

const { default: vacantesRoutes } = await import('../src/routes/vacantesRoutes.js');
const { default: notificacionRoutes } = await import('../src/routes/notificacionRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/vacantes', vacantesRoutes);
app.use('/api/notificaciones', notificacionRoutes);

// Token de administrador con el mismo número que la empresa dueña.
const ADMIN_MISMO_ID = () => firmarAdmin({}, { subject: '3' });

const VACANTE = {
  id: 5, titulo: 'Analista', descripcion: '<p>Funciones</p>', estado: 'ABIERTA', tipo: 'Indefinido',
  empresaId: 3, fechaCreacion: new Date('2026-01-15'), updatedAt: new Date('2026-01-20'),
  _count: { postulaciones: 1 },
};

beforeEach(() => {
  vi.clearAllMocks();
  db.vacante.findMany.mockImplementation(async (args) => proyectar([VACANTE], args));
  db.postulacion.findMany.mockImplementation(async (args) => proyectar([postulacionCompleta()], args));
  db.notificacion.findMany.mockImplementation(async (args) => proyectar([notificacionEmpresaCompleta()], args));
});

const consultas = () => db.vacante.findMany.mock.calls.length
  + db.postulacion.findMany.mock.calls.length + db.notificacion.findMany.mock.calls.length;

const RUTAS = {
  'GET /api/vacantes/empresa/:id/metricas-pro': (id) => `/api/vacantes/empresa/${id}/metricas-pro`,
  'GET /api/notificaciones/empresa/:empresaId': (id) => `/api/notificaciones/empresa/${id}`,
};

const pedir = (url, token) => {
  const peticion = request(app).get(url);
  return token ? peticion.set('Authorization', token()) : peticion;
};

describe.each(Object.entries(RUTAS))('%s', (_, ruta) => {
  it('sin token responde 403 y no consulta', async () => {
    const res = await pedir(ruta(3));
    expect(res.status).toBe(403);
    expect(consultas()).toBe(0);
  });

  it('con token de egresado (mismo id numérico) responde 403 y no consulta', async () => {
    const res = await pedir(ruta(3), EGRESADO_MISMO_ID);
    expect(res.status).toBe(403);
    expect(consultas()).toBe(0);
  });

  it('con token de administrador (mismo número) responde 403 y no consulta', async () => {
    const res = await pedir(ruta(3), ADMIN_MISMO_ID);
    expect(res.status).toBe(403);
    expect(consultas()).toBe(0);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it('otra empresa, una inexistente y un id no numérico reciben el mismo 404 sin consultar', async () => {
    const ajena = await pedir(ruta(3), OTRA_EMPRESA);
    const inexistente = await pedir(ruta(999), OTRA_EMPRESA);
    const noNumerico = await pedir(ruta('abc'), OTRA_EMPRESA);
    const conSufijo = await pedir(ruta('4abc'), OTRA_EMPRESA);
    for (const res of [ajena, inexistente, noNumerico, conSufijo]) {
      expect(res.status).toBe(404);
      expect(res.body).toEqual(ajena.body);
    }
    expect(consultas()).toBe(0);
  });

  it('la propia empresa consulta sólo con su id', async () => {
    const res = await pedir(ruta(3), EMPRESA_DUENA);
    expect(res.status).toBe(200);
    expect(consultas()).toBeGreaterThan(0);
    for (const [args] of db.notificacion.findMany.mock.calls) expect(args.where).toEqual({ empresaId: 3 });
    for (const [args] of db.vacante.findMany.mock.calls) expect(args.where).toEqual({ empresaId: 3 });
    for (const [args] of db.postulacion.findMany.mock.calls) expect(args.where).toEqual({ vacante: { empresaId: 3 } });
  });
});

describe('GET /api/vacantes/empresa/:id/metricas-pro (respuesta de la dueña)', () => {
  it('devuelve sólo lo que lee EmpresaMetricas', async () => {
    const res = await pedir(RUTAS['GET /api/vacantes/empresa/:id/metricas-pro'](3), EMPRESA_DUENA);
    expect(res.status).toBe(200);
    expect(Object.keys(res.body).sort()).toEqual(['notificacionesRecientes', 'postulacionesRecientes', 'vacantes']);

    // Las vacantes son de la propia empresa: se conservan con su conteo.
    expect(res.body.vacantes[0]).toMatchObject({ id: 5, titulo: 'Analista', estado: 'ABIERTA', _count: { postulaciones: 1 } });

    const p = res.body.postulacionesRecientes[0];
    expect(Object.keys(p).sort()).toEqual(['egresado', 'fecha', 'id', 'vacante']);
    expect(Object.keys(p.egresado).sort()).toEqual(['apellidos', 'nombres']);
    expect(Object.keys(p.vacante)).toEqual(['titulo']);

    const n = res.body.notificacionesRecientes[0];
    expect(Object.keys(n).sort()).toEqual(['contenido', 'fecha', 'id']);
  });
});

describe('GET /api/notificaciones/empresa/:empresaId (respuesta de la dueña)', () => {
  it('devuelve sólo lo que leen NotificacionesEmpresa y el panel, sin la postulación', async () => {
    const res = await pedir(RUTAS['GET /api/notificaciones/empresa/:empresaId'](3), EMPRESA_DUENA);
    expect(res.status).toBe(200);
    expect(Object.keys(res.body[0]).sort()).toEqual([
      'contenido', 'egresadoId', 'fecha', 'id', 'mensajeId', 'postulacionId', 'referenciaId', 'tipo', 'vista',
    ]);
    expect(res.body[0]).toMatchObject({ tipo: 'POSTULACION', vista: false, referenciaId: 5, postulacionId: 11, egresadoId: 7 });
  });
});
