// Fase 0 (2026-10): respuesta de POST /api/auth/login.
// La rama del egresado devolvía la fila entera (hash de la contraseña, token de
// recuperación y uid de Firebase), y el frontend la guarda en localStorage.
// Ahora la consulta pide sólo lo necesario y la respuesta lleva sólo lo que lee el
// frontend. Los rechazos (todos con la misma respuesta) están en
// tests/login-uniforme.test.js.
// Prisma, Firebase y dotenv están simulados: no hay base de datos, red ni .env.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { proyectar, PROHIBIDOS, sinCampos, egresadoCompleto } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
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

const CLAVE = 'Clave-de-prueba-1';
const HASH = bcrypt.hashSync(CLAVE, 4);

// Lo que leen del objeto guardado en localStorage['usuario'] (ver CLAUDE.md, Fase 0).
const CAMPOS_EGRESADO = ['id', 'nombres', 'apellidos', 'correo', 'celular', 'programa'];
const CAMPOS_EMPRESA = ['id', 'nombres', 'correo', 'rol'];

const empresaCompleta = () => ({
  id: 3, nombre: 'Agro Andes', email: 'contacto@agroandes.com', password: HASH, estado: 'ACTIVO',
  resetToken: 'token-vigente', resetTokenExpiry: new Date(), nit: '900123', annualRevenue: '1000',
  totalAssets: '2000', equity: '3000', phones: '3100000000', contactName: 'Ana',
});

const login = (correo, password = CLAVE) => request(app).post('/api/auth/login').send({ correo, password });

beforeEach(() => {
  vi.clearAllMocks();
  // Como Prisma: devuelve sólo lo que pide el select (sin select, la fila entera).
  db.egresado.findUnique.mockImplementation(async (consulta) =>
    consulta.where.correo === 'laura@ejemplo.com' ? proyectar({ ...egresadoCompleto(7), password: HASH }, consulta) : null);
  db.empresa.findUnique.mockImplementation(async (consulta) =>
    consulta.where.email === 'contacto@agroandes.com' ? proyectar(empresaCompleta(), consulta) : null);
});

describe('POST /api/auth/login — egresado', () => {
  it('responde sólo los campos que lee el frontend, sin secretos', async () => {
    const res = await login('Laura@Ejemplo.com');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, tipo: 'egresado' });
    expect(sinCampos(res.body.usuario, PROHIBIDOS)).toEqual([]);
    expect(Object.keys(res.body.usuario).sort()).toEqual([...CAMPOS_EGRESADO].sort());
    expect(res.body.usuario).toMatchObject({
      id: 7, nombres: 'Laura', apellidos: 'Gómez', correo: 'laura@ejemplo.com', celular: '3000000000', programa: 'Sistemas',
    });
    expect(jwt.decode(res.body.token)).toMatchObject({ id: 7, rol: 'egresado' });
  });

  it('consulta con select explícito, sin token de recuperación ni uid de Firebase', async () => {
    await login('laura@ejemplo.com');
    const { select } = db.egresado.findUnique.mock.calls[0][0];
    expect(select).toBeDefined();
    expect(sinCampos(select, ['resetToken', 'resetTokenExpiry', 'firebaseUid'])).toEqual([]);
  });

  it('cuenta inactiva con la contraseña correcta: el texto de siempre, ahora con codigo', async () => {
    db.egresado.findUnique.mockImplementation(async (consulta) =>
      proyectar({ ...egresadoCompleto(7), password: HASH, estado: 'INACTIVO' }, consulta));
    expect((await login('laura@ejemplo.com')).body).toEqual({
      success: false, codigo: 'cuenta_inactiva',
      message: 'Tu cuenta ha sido desactivada por el administrador. Contacta con la Universidad.',
    });
  });
});

describe('POST /api/auth/login — empresa', () => {
  it('responde sólo los campos que lee el frontend, sin secretos', async () => {
    const res = await login('contacto@agroandes.com');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, tipo: 'empresa' });
    expect(sinCampos(res.body.usuario, PROHIBIDOS)).toEqual([]);
    expect(res.body.usuario).toEqual({ id: 3, nombres: 'Agro Andes', correo: 'contacto@agroandes.com', rol: 'empresa' });
    expect(Object.keys(res.body.usuario).sort()).toEqual([...CAMPOS_EMPRESA].sort());
    expect(jwt.decode(res.body.token)).toMatchObject({ id: 3, rol: 'empresa' });
  });

  it('consulta con select explícito, sin token de recuperación ni datos financieros', async () => {
    await login('contacto@agroandes.com');
    const { select } = db.empresa.findUnique.mock.calls[0][0];
    expect(select).toBeDefined();
    expect(sinCampos(select, ['resetToken', 'resetTokenExpiry', 'annualRevenue', 'totalAssets', 'equity', 'nit'])).toEqual([]);
  });

  it('cuenta inactiva con la contraseña correcta: el texto de siempre, ahora con codigo', async () => {
    db.empresa.findUnique.mockImplementation(async (consulta) => proyectar({ ...empresaCompleta(), estado: 'INACTIVO' }, consulta));
    expect((await login('contacto@agroandes.com')).body).toEqual({
      success: false, codigo: 'cuenta_inactiva',
      message: 'Tu cuenta de empresa ha sido desactivada por el administrador. Contacta con la Universidad.',
    });
  });
});
