// Fase 1 (2026-10): POST /api/auth/admin/login.
// Hasta ahora el admin entraba con credenciales escritas en el frontend y un token
// falso. Este endpoint consulta sólo la tabla Administrador y emite un token de
// 2 h con sub + aud "admin" (sin id, para que ningún controlador lo confunda con
// un egresado o una empresa). Usuario inexistente, contraseña incorrecta y cuenta
// inactiva responden exactamente lo mismo.
// Prisma, Firebase y dotenv están simulados: no hay base de datos, red ni .env.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { proyectar } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  administrador: { findUnique: vi.fn(), update: vi.fn() },
  egresado: { findUnique: vi.fn() },
  empresa: { findUnique: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('../src/config/firebase-admin.js', () => ({ default: {} }));
vi.mock('dotenv', () => ({ default: { config: vi.fn() }, config: vi.fn() }));

const { default: authRoutes } = await import('../src/routes/authRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

const CLAVE = 'Clave-de-admin-larga-1';
const HASH = bcrypt.hashSync(CLAVE, 4);
const RECHAZO = { message: 'Usuario o contraseña incorrectos' };

const adminCompleto = (cambios = {}) => ({
  id: 1, usuario: 'admin.ops', password: HASH, nombre: 'Oficina de Egresados', activo: true,
  ultimoAcceso: null, createdAt: new Date('2026-10-01'), updatedAt: new Date('2026-10-01'), ...cambios,
});

const entrar = (cuerpo) => request(app).post('/api/auth/admin/login').send(cuerpo);
const todoElTexto = (res) => JSON.stringify(res.body);

let fila;
beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  fila = adminCompleto();
  db.administrador.findUnique.mockImplementation(async (consulta) =>
    consulta.where.usuario === fila.usuario ? proyectar(fila, consulta) : null);
  db.administrador.update.mockImplementation(async (consulta) => proyectar({ ...fila, ...consulta.data }, consulta));
});

describe('POST /api/auth/admin/login — éxito', () => {
  it('emite un token de 2 h con sub, rol y aud "admin", sin id', async () => {
    const res = await entrar({ usuario: 'admin.ops', password: CLAVE });
    expect(res.status).toBe(200);
    const datos = jwt.verify(res.body.token, process.env.JWT_SECRET, { audience: 'admin' });
    expect(datos).toMatchObject({ sub: '1', rol: 'admin', aud: 'admin' });
    expect(datos).not.toHaveProperty('id');
    expect(datos.exp - datos.iat).toBe(2 * 60 * 60);
  });

  it('responde token + { usuario, nombre, rol }, sin hash ni nada más', async () => {
    const res = await entrar({ usuario: 'admin.ops', password: CLAVE });
    expect(Object.keys(res.body).sort()).toEqual(['token', 'usuario']);
    expect(res.body.usuario).toEqual({ usuario: 'admin.ops', nombre: 'Oficina de Egresados', rol: 'admin' });
    expect(todoElTexto(res)).not.toContain(HASH);
    expect(todoElTexto(res)).not.toContain('password');
  });

  it('normaliza el usuario (espacios y mayúsculas)', async () => {
    const res = await entrar({ usuario: '  Admin.OPS ', password: CLAVE });
    expect(res.status).toBe(200);
    expect(db.administrador.findUnique.mock.calls[0][0].where).toEqual({ usuario: 'admin.ops' });
  });

  it('actualiza ultimoAcceso', async () => {
    const antes = Date.now();
    await entrar({ usuario: 'admin.ops', password: CLAVE });
    expect(db.administrador.update).toHaveBeenCalledTimes(1);
    const { where, data } = db.administrador.update.mock.calls[0][0];
    expect(where).toEqual({ id: 1 });
    expect(data.ultimoAcceso).toBeInstanceOf(Date);
    expect(data.ultimoAcceso.getTime()).toBeGreaterThanOrEqual(antes);
  });

  it('consulta sólo Administrador, nunca Egresado ni Empresa', async () => {
    await entrar({ usuario: 'admin.ops', password: CLAVE });
    expect(db.egresado.findUnique).not.toHaveBeenCalled();
    expect(db.empresa.findUnique).not.toHaveBeenCalled();
  });
});

describe('POST /api/auth/admin/login — rechazos idénticos', () => {
  const casos = {
    'usuario inexistente': () => entrar({ usuario: 'nadie', password: CLAVE }),
    'contraseña incorrecta': () => entrar({ usuario: 'admin.ops', password: 'otra-clave-cualquiera' }),
    'admin inactivo (aun con la contraseña correcta)': () => {
      fila = adminCompleto({ activo: false });
      return entrar({ usuario: 'admin.ops', password: CLAVE });
    },
  };

  for (const [nombre, intento] of Object.entries(casos)) {
    it(`${nombre}: 401 con el mismo cuerpo, sin token y sin tocar ultimoAcceso`, async () => {
      const res = await intento();
      expect(res.status).toBe(401);
      expect(res.body).toEqual(RECHAZO);
      expect(db.administrador.update).not.toHaveBeenCalled();
    });
  }

  it('el usuario inexistente también pasa por bcrypt.compare (contra un hash ficticio)', async () => {
    const comparar = vi.spyOn(bcrypt, 'compare');
    await entrar({ usuario: 'nadie', password: CLAVE });
    expect(comparar).toHaveBeenCalledTimes(1);
    const [, hashFicticio] = comparar.mock.calls[0];
    expect(hashFicticio).toMatch(/^\$2[aby]\$12\$/); // mismo costo que las cuentas reales
  });

  it('cuerpo incompleto o con tipos raros: el mismo 401', async () => {
    for (const cuerpo of [{}, { usuario: 'admin.ops' }, { password: CLAVE }, { usuario: ['admin.ops'], password: CLAVE },
      { usuario: 'admin.ops', password: { $ne: null } }]) {
      const res = await entrar(cuerpo);
      expect(res.status).toBe(401);
      expect(res.body).toEqual(RECHAZO);
    }
  });

  it('un error de la base responde 500 sin detalles', async () => {
    db.administrador.findUnique.mockRejectedValue(new Error('conexión rechazada a ep-secreto.neon.tech'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await entrar({ usuario: 'admin.ops', password: CLAVE });
    expect(res.status).toBe(500);
    expect(todoElTexto(res)).not.toContain('neon');
  });
});

describe('POST /api/auth/login (egresado / empresa) no cambia', () => {
  it('nunca consulta Administrador ni emite un token de admin', async () => {
    db.egresado.findUnique.mockResolvedValue(null);
    db.empresa.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({ correo: 'admin.ops', password: CLAVE });
    expect(res.body).toEqual({ success: false, message: 'Credenciales no encontradas' });
    expect(res.body.token).toBeUndefined();
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });
});

// El límite de intentos del Firewall de Vercel compara la ruta exacta. Express no
// distingue mayúsculas ni la barra final: cualquier otra forma de la ruta sigue
// como una ruta desconocida (404), sin consultar la tabla ni comparar contraseñas.
describe('POST /api/auth/admin/login — sólo con la ruta exacta', () => {
  it.each([
    '/api/auth/admin/login/',
    '/API/auth/admin/login',
    '/api/auth/admin/LOGIN',
    '/api/Auth/Admin/Login',
  ])('%s responde 404 y no consulta', async (ruta) => {
    const res = await request(app).post(ruta).send({ usuario: 'admin.ops', password: CLAVE });
    expect(res.status).toBe(404);
    expect(res.body.token).toBeUndefined();
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it('la ruta exacta con query sigue funcionando', async () => {
    const res = await request(app).post('/api/auth/admin/login?origen=panel').send({ usuario: 'admin.ops', password: CLAVE });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
  });
});
