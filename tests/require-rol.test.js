// Fase 1 (2026-10): requireRol('admin').
// Además del rol, exige el token que emite POST /api/auth/admin/login (aud
// "admin", sub = id del Administrador) y comprueba en cada petición que la cuenta
// exista y siga activa: desactivarla corta el acceso sin esperar a que venza el
// token (401 { codigo: "sesion_invalida" }, igual si la cuenta ya no existe).
// Los tokens de admin no sirven en las rutas de egresado ni de empresa.
// Todavía no protege ninguna ruta real (eso es la fase 3): se prueba sobre una
// ruta de ensayo, y las rutas reales se prueban con el token de admin.
// Prisma, Supabase y el correo están simulados: no hay base de datos, red ni envíos.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { firmar, firmarAdmin, TOKEN_ADMIN } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  administrador: { findUnique: vi.fn() },
  egresado: { findUnique: vi.fn(), update: vi.fn() },
  perfilCV: { findUnique: vi.fn(), upsert: vi.fn() },
  vacante: { findUnique: vi.fn() },
  postulacion: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
  notificacion: { create: vi.fn() },
  empresa: { update: vi.fn() },
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
app.get('/ensayo/admin', authMiddleware, requireRol('admin'), (req, res) => res.json({ ok: true, admin: req.admin }));
app.get('/ensayo/egresado', authMiddleware, requireRol('egresado'), (req, res) => res.json({ ok: true }));
app.get('/ensayo/empresa', authMiddleware, requireRol('empresa'), (req, res) => res.json({ ok: true }));
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/cvs', cvsRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/empresas', empresaRoutes);

const llamadasFueraDeAdministrador = () => Object.entries(db)
  .filter(([modelo]) => modelo !== 'administrador')
  .flatMap(([, metodos]) => Object.values(metodos))
  .reduce((total, fn) => total + fn.mock.calls.length, 0);

const ADMIN_ACTIVO = { id: 1, usuario: 'admin.ops', nombre: 'Oficina de Egresados', activo: true };
const pedir = (ruta, token) => request(app).get(ruta).set('Authorization', token);

beforeEach(() => {
  vi.clearAllMocks();
  db.administrador.findUnique.mockImplementation(async ({ where }) => (where.id === 1 ? { ...ADMIN_ACTIVO } : null));
});

describe("requireRol('admin')", () => {
  it('deja pasar el token de un admin activo y consulta la cuenta en cada petición', async () => {
    for (let i = 0; i < 2; i++) {
      const res = await pedir('/ensayo/admin', TOKEN_ADMIN());
      expect(res.status).toBe(200);
    }
    expect(db.administrador.findUnique).toHaveBeenCalledTimes(2);
    expect(db.administrador.findUnique.mock.calls[0][0].where).toEqual({ id: 1 });
  });

  it('deja en req.admin la cuenta, sin hash', async () => {
    const res = await pedir('/ensayo/admin', TOKEN_ADMIN());
    expect(res.body.admin).toEqual({ id: 1, usuario: 'admin.ops', nombre: 'Oficina de Egresados' });
    const { select } = db.administrador.findUnique.mock.calls[0][0];
    expect(select).toBeDefined();
    expect(select.password).toBeFalsy();
  });

  it('admin inactivo → 401 { codigo: "sesion_invalida" }', async () => {
    db.administrador.findUnique.mockResolvedValue({ ...ADMIN_ACTIVO, activo: false });
    const res = await pedir('/ensayo/admin', TOKEN_ADMIN());
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ codigo: 'sesion_invalida' });
  });

  it('admin que ya no existe → el mismo 401 con el mismo cuerpo', async () => {
    const res = await pedir('/ensayo/admin', firmarAdmin({}, { subject: '99' }));
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ codigo: 'sesion_invalida' });
  });

  it('token de egresado con el rol cambiado a "admin" pero sin aud → 403, sin consultar la base', async () => {
    const res = await pedir('/ensayo/admin', firmar({ id: 1, rol: 'admin' }));
    expect(res.status).toBe(403);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it('aud distinta de "admin" → 403', async () => {
    expect((await pedir('/ensayo/admin', firmarAdmin({}, { audience: 'egresado' }))).status).toBe(403);
  });

  it('aud "admin" sin sub, o con sub que no es un id → 403', async () => {
    expect((await pedir('/ensayo/admin', firmar({ rol: 'admin', aud: 'admin' }))).status).toBe(403);
    expect((await pedir('/ensayo/admin', firmarAdmin({}, { subject: 'admin.ops' }))).status).toBe(403);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it('aud "admin" con otro rol → 403', async () => {
    expect((await pedir('/ensayo/admin', firmarAdmin({ rol: 'egresado' }))).status).toBe(403);
  });

  it('tokens de egresado y de empresa → 403', async () => {
    expect((await pedir('/ensayo/admin', firmar({ id: 1, rol: 'egresado' }))).status).toBe(403);
    expect((await pedir('/ensayo/admin', firmar({ id: 1, rol: 'empresa' }))).status).toBe(403);
  });

  it('token vencido → 401 (authMiddleware), sin consultar la base', async () => {
    const res = await pedir('/ensayo/admin', firmarAdmin({}, { expiresIn: -10 }));
    expect(res.status).toBe(401);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it('un error de la base responde 500 sin detalles, nunca deja pasar', async () => {
    db.administrador.findUnique.mockRejectedValue(new Error('conexión rechazada a ep-secreto.neon.tech'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await pedir('/ensayo/admin', TOKEN_ADMIN());
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain('neon');
  });
});

describe("requireRol('egresado') y ('empresa') rechazan tokens de admin", () => {
  it('ruta de ensayo de egresado y de empresa → 403', async () => {
    expect((await pedir('/ensayo/egresado', TOKEN_ADMIN())).status).toBe(403);
    expect((await pedir('/ensayo/empresa', TOKEN_ADMIN())).status).toBe(403);
  });

  it('un token con aud "admin" no vale aunque diga rol egresado o empresa', async () => {
    expect((await pedir('/ensayo/egresado', firmarAdmin({ rol: 'egresado', id: 7 }))).status).toBe(403);
    expect((await pedir('/ensayo/empresa', firmarAdmin({ rol: 'empresa', id: 3 }))).status).toBe(403);
  });

  it('los tokens normales siguen pasando', async () => {
    expect((await pedir('/ensayo/egresado', firmar({ id: 7, rol: 'egresado' }))).status).toBe(200);
    expect((await pedir('/ensayo/empresa', firmar({ id: 3, rol: 'empresa' }))).status).toBe(200);
  });
});

describe('token de admin contra las rutas reales de egresado, empresa y /cvs', () => {
  const RUTAS = [
    ['get', '/api/estudiantes/perfil'],
    ['put', '/api/estudiantes/actualizar', { nombres: 'Otra' }],
    ['get', '/api/estudiantes/mi-cv'],
    ['post', '/api/estudiantes/guardar-cv', {}],
    ['post', '/api/estudiantes/5/postular', { telefono: '3000000000' }],
    ['post', '/api/postulaciones/enviar', { vacanteId: 5 }],
    ['get', '/api/cvs/1'],
    ['post', '/api/cvs/1', {}],
    ['get', '/api/postulaciones/vacante/5'],
    ['get', '/api/postulaciones/empresa/1'],
    ['put', '/api/postulaciones/11/estado', { estado: 'ACEPTADO' }],
    ['put', '/api/postulaciones/11/anclaje', { anclado: true }],
    ['put', '/api/postulaciones/calificar/11', { calificacion: 5 }],
    ['put', '/api/empresas/1', { nombre: 'Otra' }],
  ];

  for (const [metodo, ruta, cuerpo] of RUTAS) {
    it(`${metodo.toUpperCase()} ${ruta} → 403, sin tocar la base`, async () => {
      let peticion = request(app)[metodo](ruta).set('Authorization', TOKEN_ADMIN());
      if (cuerpo) peticion = peticion.send(cuerpo);
      const res = await peticion;
      expect(res.status).toBe(403);
      expect(llamadasFueraDeAdministrador()).toBe(0);
    });
  }
});
