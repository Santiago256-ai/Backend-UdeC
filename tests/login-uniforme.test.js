// Login uniforme (2026-10): POST /api/auth/login no revela qué correos están
// registrados ni el estado de la cuenta. Busca siempre en Egresado y en Empresa
// (las dos a la vez), compara siempre con bcrypt (contra un hash ficticio del
// mismo costo si no hay contraseña con la que comparar) y mira INACTIVO sólo
// después de una contraseña correcta. Todo rechazo de credenciales responde el
// mismo estado y el mismo cuerpo.
// Prisma, Firebase y dotenv están simulados: no hay base de datos, red ni .env.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { proyectar, egresadoCompleto } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  egresado: { findUnique: vi.fn(), create: vi.fn() },
  empresa: { findUnique: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('../src/config/firebase-admin.js', () => ({ default: {} }));
vi.mock('dotenv', () => ({ default: { config: vi.fn() }, config: vi.fn() }));

const { default: authRoutes } = await import('../src/routes/authRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

const CLAVE = 'Clave-de-prueba-1';
const HASH = bcrypt.hashSync(CLAVE, 4);
const RECHAZO = { success: false, codigo: 'credenciales_invalidas', message: 'Correo o contraseña incorrectos.' };

// Cuentas por correo. Se cambian en cada prueba.
let egresados;
let empresas;
const empresaCompleta = (cambios = {}) => ({
  id: 3, nombre: 'Agro Andes', email: 'contacto@agroandes.com', password: HASH, estado: 'ACTIVO',
  resetToken: 'token-vigente', nit: '900123', ...cambios,
});

const login = (cuerpo) => request(app).post('/api/auth/login').send(cuerpo);

let compare;
beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  egresados = {
    'laura@ejemplo.com': { ...egresadoCompleto(7), password: HASH },
    'google@ejemplo.com': { ...egresadoCompleto(8), correo: 'google@ejemplo.com', password: null },
    'inactiva@ejemplo.com': { ...egresadoCompleto(9), correo: 'inactiva@ejemplo.com', password: HASH, estado: 'INACTIVO' },
  };
  empresas = {
    'contacto@agroandes.com': empresaCompleta(),
    'cerrada@agroandes.com': empresaCompleta({ id: 4, email: 'cerrada@agroandes.com', estado: 'INACTIVO' }),
  };
  db.egresado.findUnique.mockImplementation(async (c) => (egresados[c.where.correo] ? proyectar(egresados[c.where.correo], c) : null));
  db.empresa.findUnique.mockImplementation(async (c) => (empresas[c.where.email] ? proyectar(empresas[c.where.email], c) : null));
  compare = vi.spyOn(bcrypt, 'compare');
});

describe('POST /api/auth/login — todo rechazo de credenciales responde lo mismo', () => {
  const RECHAZOS = [
    ['correo inexistente', { correo: 'nadie@ejemplo.com', password: CLAVE }],
    ['contraseña incorrecta (egresado)', { correo: 'laura@ejemplo.com', password: 'otra' }],
    ['cuenta de Google (sin contraseña)', { correo: 'google@ejemplo.com', password: CLAVE }],
    ['cuenta inactiva con contraseña incorrecta (egresado)', { correo: 'inactiva@ejemplo.com', password: 'otra' }],
    ['contraseña incorrecta (empresa)', { correo: 'contacto@agroandes.com', password: 'otra' }],
    ['cuenta inactiva con contraseña incorrecta (empresa)', { correo: 'cerrada@agroandes.com', password: 'otra' }],
    ['contraseña vacía', { correo: 'laura@ejemplo.com', password: '' }],
    ['cuerpo sin correo ni contraseña', {}],
  ];

  it.each(RECHAZOS)('%s: 200 y el cuerpo de credenciales inválidas', async (_, cuerpo) => {
    const res = await login(cuerpo);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(RECHAZO);
  });

  it('las cuatro respuestas pedidas son idénticas byte a byte (estado, cuerpo y tipo de contenido)', async () => {
    const respuestas = [];
    for (const [, cuerpo] of RECHAZOS.slice(0, 4)) respuestas.push(await login(cuerpo));
    const huella = (res) => JSON.stringify([res.status, res.headers['content-type'], res.text]);
    expect(new Set(respuestas.map(huella)).size).toBe(1);
  });

  it.each(RECHAZOS)('%s: compara con bcrypt exactamente una vez', async (_, cuerpo) => {
    await login(cuerpo);
    expect(compare).toHaveBeenCalledTimes(1);
  });

  it('sin cuenta o con cuenta de Google compara contra un hash del costo de registro (10)', async () => {
    await login({ correo: 'nadie@ejemplo.com', password: CLAVE });
    await login({ correo: 'google@ejemplo.com', password: CLAVE });
    const hashes = compare.mock.calls.map(([, hash]) => hash);
    expect(hashes[0]).toBe(hashes[1]);
    expect(bcrypt.getRounds(hashes[0])).toBe(10);
  });

  it('el costo del hash ficticio es el mismo con el que se registran los egresados', async () => {
    const hash = vi.spyOn(bcrypt, 'hash');
    db.egresado.create.mockImplementation(async ({ data }) => ({ id: 1, ...data }));
    await request(app).post('/api/auth/register').send({
      nombres: 'Ana', apellidos: 'Ruiz', correo: 'ana@ejemplo.com', password: CLAVE,
    });
    expect(hash).toHaveBeenCalledWith(CLAVE, 10);
    await login({ correo: 'nadie@ejemplo.com', password: CLAVE });
    expect(bcrypt.getRounds(compare.mock.calls.at(-1)[1])).toBe(10);
  });
});

describe('POST /api/auth/login — consultas', () => {
  it.each([
    ['egresado', 'laura@ejemplo.com'],
    ['empresa', 'contacto@agroandes.com'],
    ['nadie', 'nadie@ejemplo.com'],
  ])('busca siempre en las dos tablas, a la vez (%s)', async (_, correo) => {
    let empresaYaPedida = null;
    const original = db.egresado.findUnique.getMockImplementation();
    db.egresado.findUnique.mockImplementation(async (c) => {
      await Promise.resolve();
      empresaYaPedida = db.empresa.findUnique.mock.calls.length > 0;
      return original(c);
    });
    await login({ correo, password: CLAVE });
    expect(db.egresado.findUnique).toHaveBeenCalledTimes(1);
    expect(db.empresa.findUnique).toHaveBeenCalledTimes(1);
    expect(empresaYaPedida).toBe(true); // la de empresa salió antes de que terminara la de egresado
  });
});

describe('POST /api/auth/login — cuenta inactiva', () => {
  it.each([
    ['egresado', 'inactiva@ejemplo.com', 'Tu cuenta ha sido desactivada por el administrador. Contacta con la Universidad.'],
    ['empresa', 'cerrada@agroandes.com', 'Tu cuenta de empresa ha sido desactivada por el administrador. Contacta con la Universidad.'],
  ])('%s con la contraseña correcta: codigo cuenta_inactiva y el texto de siempre, sin token', async (_, correo, texto) => {
    const res = await login({ correo, password: CLAVE });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: false, codigo: 'cuenta_inactiva', message: texto });
    expect(compare).toHaveBeenCalledTimes(1);
  });

  it('con la contraseña correcta y la cuenta activa sigue entrando', async () => {
    const res = await login({ correo: 'laura@ejemplo.com', password: CLAVE });
    expect(res.body).toMatchObject({ success: true, tipo: 'egresado' });
    expect(typeof res.body.token).toBe('string');
  });
});

describe('POST /api/auth/login — error del servidor', () => {
  it('500 con el mensaje genérico; el detalle sólo en el log', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    db.empresa.findUnique.mockRejectedValue(new Error('detalle interno de Prisma: conexión a la base'));
    const res = await login({ correo: 'laura@ejemplo.com', password: CLAVE });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ success: false, message: 'No pudimos iniciar sesión. Intenta de nuevo.' });
    expect(res.text).not.toContain('detalle interno');
    expect(log.mock.calls.flat().some((a) => String(a?.message ?? a).includes('detalle interno'))).toBe(true);
  });
});
