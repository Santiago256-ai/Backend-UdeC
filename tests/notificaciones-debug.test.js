// Contención 2 (2026-10): GET /api/notificaciones/debug/todas era una ruta de
// depuración sin protección que devolvía todas las notificaciones (con nombres de
// egresados en el contenido). Se elimina. Prisma está simulado.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const db = vi.hoisted(() => ({ notificacion: { findMany: vi.fn() } }));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));

const { default: notificacionRoutes } = await import('../src/routes/notificacionRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/notificaciones', notificacionRoutes);

beforeEach(() => {
  vi.clearAllMocks();
  db.notificacion.findMany.mockResolvedValue([
    { id: 1, tipo: 'POSTULACION', contenido: 'Laura se ha postulado a tu vacante: "Analista"', egresadoId: 7, empresaId: 3 },
  ]);
});

describe('GET /api/notificaciones/debug/todas', () => {
  it('ya no existe: 404 y no consulta la base', async () => {
    const res = await request(app).get('/api/notificaciones/debug/todas');
    expect(res.status).toBe(404);
    expect(db.notificacion.findMany).not.toHaveBeenCalled();
  });
});
