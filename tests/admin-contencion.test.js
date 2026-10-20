// Contención de las rutas de administración (2026-10).
// Prisma está simulado: no hay base de datos ni red. Se montan sólo las rutas
// de usuarios y empresas sobre un Express de prueba (src/server.js no se carga).
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const db = vi.hoisted(() => ({
  egresado: { findMany: vi.fn(), update: vi.fn(), delete: vi.fn() },
  empresa: { findMany: vi.fn(), update: vi.fn(), delete: vi.fn(), findUnique: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));

const { default: userRoutes } = await import('../src/routes/userRoutes.js');
const { default: empresaRoutes } = await import('../src/routes/empresaRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/usuarios', userRoutes);
app.use('/api/empresas', empresaRoutes);

const PROHIBIDOS = ['password', 'resetToken', 'resetTokenExpiry', 'firebaseUid'];
const FINANCIEROS = ['annualRevenue', 'totalAssets', 'equity'];

// Prisma devuelve sólo lo que pide `select`: el simulador hace lo mismo, así la
// prueba falla si alguien vuelve a pedir el registro completo.
const filaCompleta = {
  id: 7, nombres: 'Laura', apellidos: 'Gómez', correo: 'laura@ejemplo.com', celular: '3000000000',
  facultad: 'Ingeniería', programa: 'Sistemas', estado: 'ACTIVO', createdAt: new Date('2026-01-01'),
  nombre: 'Agro Andes', nit: '900', email: 'contacto@ejemplo.com', phones: '601', contactName: 'Ana',
  address: 'Calle 1', city: 'Fusagasugá', economicSector: ['Agro'], employees: '10',
  password: 'hash', resetToken: 'token-vigente', resetTokenExpiry: new Date(), firebaseUid: 'uid',
  annualRevenue: '1', totalAssets: '2', equity: '3', _count: { postulaciones: 2, vacantes: 1 },
};
const proyectar = (select) => Object.fromEntries(Object.keys(select).map((k) => [k, filaCompleta[k]]));

beforeEach(() => {
  vi.clearAllMocks();
  for (const modelo of [db.egresado, db.empresa]) {
    modelo.findMany.mockImplementation(async ({ select }) => [proyectar(select)]);
    modelo.update.mockImplementation(async ({ select }) => proyectar(select));
  }
});

const sinCampos = (obj, campos) => campos.filter((c) => c in obj);

describe('GET /api/usuarios/admin/todos', () => {
  it('pide y devuelve sólo los campos del panel', async () => {
    const res = await request(app).get('/api/usuarios/admin/todos');
    expect(res.status).toBe(200);
    const args = db.egresado.findMany.mock.calls[0][0];
    expect(args.include).toBeUndefined();
    expect(sinCampos(args.select, PROHIBIDOS)).toEqual([]);
    expect(Object.keys(args.select).sort()).toEqual(
      ['_count', 'apellidos', 'celular', 'correo', 'createdAt', 'estado', 'facultad', 'id', 'nombres', 'programa'],
    );
    expect(sinCampos(res.body[0], PROHIBIDOS)).toEqual([]);
  });
});

describe('PUT /api/usuarios/:id', () => {
  it('ignora correo, password, resetToken, resetTokenExpiry y firebaseUid', async () => {
    const res = await request(app).put('/api/usuarios/7').send({
      nombres: 'Laura M.', apellidos: 'Gómez', celular: '3111111111', facultad: 'Ingeniería', programa: 'Sistemas',
      estado: 'ACTIVO', correo: 'otro@ejemplo.com', password: 'x', resetToken: 'y', resetTokenExpiry: '2099-01-01', firebaseUid: 'z',
    });
    expect(res.status).toBe(200);
    const { data, select, where } = db.egresado.update.mock.calls[0][0];
    expect(where).toEqual({ id: 7 });
    expect(Object.keys(data).sort()).toEqual(['apellidos', 'celular', 'estado', 'facultad', 'nombres', 'programa']);
    expect(sinCampos(select, PROHIBIDOS)).toEqual([]);
    expect(sinCampos(res.body.usuario, PROHIBIDOS)).toEqual([]);
  });

  it('sigue aceptando el cuerpo completo que envía el panel ({...usuario})', async () => {
    const res = await request(app).put('/api/usuarios/7').send({ ...filaCompleta, nombres: 'Laura' });
    expect(res.status).toBe(200);
    expect(db.egresado.update.mock.calls[0][0].data.nombres).toBe('Laura');
  });
});

describe('GET /api/empresas/admin/todas', () => {
  it('pide sólo los campos de la lista y del modal, sin secretos ni datos financieros', async () => {
    const res = await request(app).get('/api/empresas/admin/todas');
    expect(res.status).toBe(200);
    const args = db.empresa.findMany.mock.calls[0][0];
    expect(args.include).toBeUndefined();
    expect(sinCampos(args.select, [...PROHIBIDOS, ...FINANCIEROS])).toEqual([]);
    expect(sinCampos(res.body[0], [...PROHIBIDOS, ...FINANCIEROS])).toEqual([]);
    expect(res.body[0]._count).toEqual({ postulaciones: 2, vacantes: 1 });
  });
});

describe('PUT /api/empresas/admin/:id', () => {
  it('sólo guarda los campos editables del modal; email y secretos quedan fuera', async () => {
    const res = await request(app).put('/api/empresas/admin/7').send({
      nombre: 'Agro Andes SAS', nit: '901', phones: '602', contactName: 'Ana', address: 'Calle 2', city: 'Girardot',
      economicSector: ['Agro'], employees: '12',
      email: 'atacante@ejemplo.com', password: 'x', resetToken: 'conocido', resetTokenExpiry: '2099-01-01',
      estado: 'ACTIVO', _count: { vacantes: 1 }, annualRevenue: '999', id: 99, createdAt: '2020-01-01',
    });
    expect(res.status).toBe(200);
    const { data, select, where } = db.empresa.update.mock.calls[0][0];
    expect(where).toEqual({ id: 7 });
    expect(Object.keys(data).sort()).toEqual(['address', 'city', 'contactName', 'economicSector', 'employees', 'nit', 'nombre', 'phones']);
    expect(sinCampos(select, [...PROHIBIDOS, ...FINANCIEROS])).toEqual([]);
    expect(sinCampos(res.body.empresa, [...PROHIBIDOS, ...FINANCIEROS])).toEqual([]);
  });

  it('con un cuerpo sólo de campos prohibidos no escribe nada sensible', async () => {
    await request(app).put('/api/empresas/admin/7').send({ email: 'a@b.co', resetToken: 't', resetTokenExpiry: '2099-01-01' });
    expect(db.empresa.update.mock.calls[0][0].data).toEqual({});
  });
});

describe('PUT /api/empresas/admin/estado/:id', () => {
  it('la respuesta ya no incluye secretos', async () => {
    const res = await request(app).put('/api/empresas/admin/estado/7').send({ estado: 'INACTIVO' });
    expect(res.status).toBe(200);
    expect(db.empresa.update.mock.calls[0][0].data).toEqual({ estado: 'INACTIVO' });
    expect(sinCampos(res.body.empresa, [...PROHIBIDOS, ...FINANCIEROS])).toEqual([]);
  });
});
