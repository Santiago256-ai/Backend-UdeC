// Lecturas y ediciones del panel de administración (Contención 2, 2026-10; desde
// la ronda del panel exigen sesión de administrador). Sin token o con token de
// egresado o de empresa responden 403 y no llegan a consultar la base. Lo que
// pasa con un token de administrador está en tests/panel-admin.test.js.
// Prisma está simulado: no hay base de datos ni red.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { EMPRESA_DUENA, EGRESADO_MISMO_ID } from './apoyo/simulador.js';

const db = vi.hoisted(() => {
  const modelo = () => ({
    findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn(), groupBy: vi.fn(), update: vi.fn(),
  });
  return {
    egresado: modelo(), empresa: modelo(), vacante: modelo(), postulacion: modelo(),
    administrador: modelo(),
  };
});
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => ({ enviarCorreoCambioEstado: vi.fn() }));

const { default: userRoutes } = await import('../src/routes/userRoutes.js');
const { default: empresaRoutes } = await import('../src/routes/empresaRoutes.js');
const { default: postulacionesRoutes } = await import('../src/routes/postulacionesRoutes.js');
const { default: vacantesRoutes } = await import('../src/routes/vacantesRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/usuarios', userRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/vacantes', vacantesRoutes);

const llamadasALaBase = () => Object.values(db)
  .flatMap((modelo) => Object.values(modelo))
  .reduce((total, fn) => total + fn.mock.calls.length, 0);

beforeEach(() => {
  vi.clearAllMocks();
  // Con el código anterior estas rutas respondían 200 con lo que hubiera en la base.
  for (const modelo of Object.values(db)) {
    modelo.findMany.mockResolvedValue([]);
    modelo.findUnique.mockResolvedValue({ id: 1, estado: 'ACTIVO' });
    modelo.count.mockResolvedValue(0);
    modelo.groupBy.mockResolvedValue([]);
    modelo.update.mockResolvedValue({ id: 1 });
  }
});

const RUTAS = [
  ['get', '/api/usuarios/admin/todos'],
  ['get', '/api/empresas/admin/todas'],
  ['get', '/api/postulaciones/admin/todas'],
  ['get', '/api/vacantes/admin/todas'],
  ['get', '/api/vacantes/stats'],
  ['put', '/api/usuarios/7'],
  ['put', '/api/empresas/admin/3'],
  ['put', '/api/empresas/admin/estado/3'],
];

const SESIONES = [
  ['sin token', null],
  ['con token de empresa', EMPRESA_DUENA],
  ['con token de egresado', EGRESADO_MISMO_ID],
];

describe.each(RUTAS)('%s %s (administración, sin sesión de administrador)', (metodo, ruta) => {
  it.each(SESIONES)('%s responde 403 y no consulta la base', async (_, token) => {
    let peticion = request(app)[metodo](ruta);
    if (token) peticion = peticion.set('Authorization', token());
    if (metodo === 'put') peticion = peticion.send({ nombres: 'Otro', nombre: 'Otra', estado: 'ACTIVO' });
    const res = await peticion;
    expect(res.status).toBe(403);
    expect(llamadasALaBase()).toBe(0);
  });
});
