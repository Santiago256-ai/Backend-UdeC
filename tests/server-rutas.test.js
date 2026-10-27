// GET /users eliminado de src/server.js (2026-10).
// Era una ruta de prueba sin protección que consultaba un modelo inexistente
// (prisma.usuario) y siempre respondía 500. Aquí se carga la app completa de
// src/server.js, así que se simulan dotenv (nunca se lee el .env), Firebase,
// Prisma, Supabase, el correo y la IA: no hay base de datos, red ni envíos.
import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';

const db = vi.hoisted(() => ({
  usuario: { findMany: vi.fn() },
  $connect: vi.fn(),
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('dotenv/config', () => ({}));
vi.mock('dotenv', () => ({ default: { config: vi.fn() }, config: vi.fn() }));
vi.mock('firebase-admin', () => ({ default: { apps: [], initializeApp: vi.fn(), credential: { cert: vi.fn() } } }));
vi.mock('../src/config/firebase-admin.js', () => ({ default: {} }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('nodemailer', () => ({ default: { createTransport: vi.fn(() => ({ sendMail: vi.fn() })) } }));
vi.mock('@ai-sdk/google', () => ({ google: vi.fn() }));
vi.mock('ai', () => ({ generateText: vi.fn(), tool: vi.fn((definicion) => definicion) }));

let app;
beforeAll(async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {}); // Firebase sin credenciales lo reporta al cargar
  vi.spyOn(console, 'log').mockImplementation(() => {});
  ({ default: app } = await import('../src/server.js'));
});

describe('src/server.js', () => {
  it('GET /users ya no existe: 404 y no consulta la base', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(404);
    expect(db.usuario.findMany).not.toHaveBeenCalled();
  });

  it('las rutas vecinas siguen montadas (raíz y /api/usuarios)', async () => {
    expect((await request(app).get('/')).status).toBe(200);
    // /api/usuarios sigue en el bloqueo temporal del panel: 403, no 404.
    expect((await request(app).get('/api/usuarios/admin/todos')).status).toBe(403);
  });

  it('la prueba no leyó el .env: DATABASE_URL es la inventada de vitest.config.js', () => {
    expect(process.env.DATABASE_URL).toContain('127.0.0.1:1');
  });
});
