// Los tokens no se mezclan entre roles (2026-10).
// Matriz completa de quién entra dónde, antes de aplicar requireRol('admin') a
// las rutas reales del panel (eso es la fase final): la ruta de administrador se
// monta sólo aquí, en la prueba; las rutas reales de egresado y de empresa son las
// de src/routes. Prisma, Supabase y el correo están simulados: no hay base de
// datos, red ni envíos. El secreto de los tokens viene de vitest.config.js.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { firmar, firmarAdmin, TOKEN_ADMIN } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  administrador: { findUnique: vi.fn() },
  egresado: { findUnique: vi.fn(), update: vi.fn() },
  perfilCV: { findUnique: vi.fn(), upsert: vi.fn() },
  vacante: { findUnique: vi.fn() },
  postulacion: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
  notificacion: { create: vi.fn() },
  empresa: { findUnique: vi.fn(), update: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => ({ enviarCorreoCambioEstado: vi.fn() }));

const { authMiddleware } = await import('../src/middleware/authMiddleware.js');
const { requireRol } = await import('../src/middleware/requireRol.js');
const { default: estudianteRoutes } = await import('../src/routes/estudianteRoutes.js');
const { default: cvsRoutes } = await import('../src/routes/cvsRoutes.js');
const { default: postulacionesRoutes } = await import('../src/routes/postulacionesRoutes.js');
const { default: empresaRoutes } = await import('../src/routes/empresaRoutes.js');

const app = express();
app.use(express.json());
// Ruta de administrador sólo de prueba: ninguna ruta real usa todavía requireRol('admin').
app.get('/prueba/panel', authMiddleware, requireRol('admin'), (req, res) => res.json({ ok: true }));
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/cvs', cvsRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/empresas', empresaRoutes);

const ADMIN = { id: 1, usuario: 'admin.ops', nombre: 'Oficina de Egresados', activo: true };
const EGRESADO = () => firmar({ id: 7, rol: 'egresado' });
const EMPRESA = () => firmar({ id: 3, rol: 'empresa' });
const panel = (token) => {
  const peticion = request(app).get('/prueba/panel');
  return token ? peticion.set('Authorization', token) : peticion;
};
const llamadasFueraDeAdministrador = () => Object.entries(db)
  .filter(([modelo]) => modelo !== 'administrador')
  .flatMap(([, metodos]) => Object.values(metodos))
  .reduce((total, fn) => total + fn.mock.calls.length, 0);

beforeEach(() => {
  vi.clearAllMocks();
  db.administrador.findUnique.mockImplementation(async ({ where }) => (where.id === 1 ? { ...ADMIN } : null));
});

describe('ruta de administrador (montada sólo en la prueba)', () => {
  it('token de administrador activo → pasa', async () => {
    const res = await panel(TOKEN_ADMIN());
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('token válido de egresado → 403, sin consultar la tabla de administradores', async () => {
    expect((await panel(EGRESADO())).status).toBe(403);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it('token válido de empresa → 403, sin consultar la tabla de administradores', async () => {
    expect((await panel(EMPRESA())).status).toBe(403);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it('administrador desactivado → 401 { codigo: "sesion_invalida" }', async () => {
    db.administrador.findUnique.mockResolvedValue({ ...ADMIN, activo: false });
    const res = await panel(TOKEN_ADMIN());
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ codigo: 'sesion_invalida' });
  });

  it('administrador inexistente → exactamente la misma respuesta que el desactivado', async () => {
    db.administrador.findUnique.mockResolvedValue({ ...ADMIN, activo: false });
    const desactivado = await panel(TOKEN_ADMIN());
    db.administrador.findUnique.mockResolvedValue(null);
    const inexistente = await panel(TOKEN_ADMIN());
    expect(inexistente.status).toBe(401);
    expect(inexistente.body).toEqual(desactivado.body);
    expect(inexistente.headers['content-type']).toBe(desactivado.headers['content-type']);
  });

  it('token vencido (de cualquier rol) → 401', async () => {
    expect((await panel(firmarAdmin({}, { expiresIn: -10 }))).status).toBe(401);
    const vencido = (payload) => `Bearer ${jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: -10 })}`;
    expect((await panel(vencido({ id: 7, rol: 'egresado' }))).status).toBe(401);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it('sin token → 403 (comportamiento de authMiddleware para todos los roles)', async () => {
    expect((await panel()).status).toBe(403);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });
});

describe('token de administrador en rutas reales de egresado y de empresa', () => {
  const RUTAS = [
    // egresado
    ['get', '/api/estudiantes/perfil'],
    ['get', '/api/estudiantes/mi-cv'],
    ['put', '/api/estudiantes/actualizar', { nombres: 'Otra' }],
    ['post', '/api/estudiantes/5/postular', { telefono: '3000000000' }],
    ['get', '/api/cvs/7'],
    ['post', '/api/cvs/7', {}],
    // empresa
    ['get', '/api/postulaciones/vacante/5'],
    ['get', '/api/postulaciones/empresa/3'],
    ['put', '/api/postulaciones/11/estado', { estado: 'ACEPTADO' }],
    ['put', '/api/empresas/3', { nombre: 'Otra' }],
  ];

  for (const [metodo, ruta, cuerpo] of RUTAS) {
    it(`${metodo.toUpperCase()} ${ruta}: no pasa (403 o 401, nunca 2xx) y no toca la base`, async () => {
      let peticion = request(app)[metodo](ruta).set('Authorization', TOKEN_ADMIN());
      if (cuerpo) peticion = peticion.send(cuerpo);
      const res = await peticion;
      expect([401, 403]).toContain(res.status);
      expect(llamadasFueraDeAdministrador()).toBe(0);
    });
  }
});
