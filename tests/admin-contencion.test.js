// Contención de las rutas de administración (2026-10).
// Prisma está simulado: no hay base de datos ni red. Se montan sólo las rutas
// de usuarios y empresas sobre un Express de prueba (src/server.js no se carga).
//
// Las rutas reales exigen sesión de administrador (tests/admin-lecturas.test.js y
// tests/panel-admin.test.js). Aquí los controladores se prueban montados
// directamente: lo que devuelven y lo que dejan escribir.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const db = vi.hoisted(() => ({
  egresado: { findMany: vi.fn(), update: vi.fn(), delete: vi.fn(), findUnique: vi.fn() },
  empresa: { findMany: vi.fn(), update: vi.fn(), delete: vi.fn(), findUnique: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));

const { default: userRoutes } = await import('../src/routes/userRoutes.js');
const { default: empresaRoutes } = await import('../src/routes/empresaRoutes.js');
const { obtenerTodosLosEgresados, actualizarEgresadoAdmin } = await import('../src/controllers/userController.js');
const { obtenerEmpresasParaAdmin, actualizarEmpresaAdmin } = await import('../src/controllers/empresaController.js');

const app = express();
app.use(express.json());
// Controladores del panel montados sin la ruta real (que exige sesión de administrador).
app.get('/api/usuarios/admin/todos', obtenerTodosLosEgresados);
app.put('/api/usuarios/:id', actualizarEgresadoAdmin);
app.get('/api/empresas/admin/todas', obtenerEmpresasParaAdmin);
app.put('/api/empresas/admin/:id', actualizarEmpresaAdmin);
const appRutas = express();
appRutas.use(express.json());
appRutas.use('/api/usuarios', userRoutes);
appRutas.use('/api/empresas', empresaRoutes);

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
  db.egresado.findUnique.mockResolvedValue({ estado: 'ACTIVO' });
});

const sinCampos = (obj, campos) => campos.filter((c) => c in obj);

describe('obtenerTodosLosEgresados (controlador de GET /api/usuarios/admin/todos)', () => {
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

describe('actualizarEgresadoAdmin (controlador de PUT /api/usuarios/:id)', () => {
  it('ignora correo, password, resetToken, resetTokenExpiry, firebaseUid, rol e id', async () => {
    const res = await request(app).put('/api/usuarios/7').send({
      nombres: 'Laura M.', apellidos: 'Gómez', celular: '3111111111', facultad: 'Ingeniería', programa: 'Sistemas',
      estado: 'ACTIVO', correo: 'otro@ejemplo.com', password: 'x', resetToken: 'y', resetTokenExpiry: '2099-01-01', firebaseUid: 'z',
      rol: 'admin', id: 99,
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

  it('activar o desactivar escribe el estado (botón del panel)', async () => {
    const res = await request(app).put('/api/usuarios/7').send({ ...filaCompleta, estado: 'INACTIVO' });
    expect(res.status).toBe(200);
    expect(db.egresado.update.mock.calls[0][0].data.estado).toBe('INACTIVO');
  });

  it('rechaza con 400 un estado que no es ACTIVO ni INACTIVO y no escribe nada', async () => {
    for (const estado of ['BORRADO', 'activo', '', null, 1]) {
      const res = await request(app).put('/api/usuarios/7').send({ nombres: 'Laura', estado });
      expect(res.status).toBe(400);
    }
    expect(db.egresado.update).not.toHaveBeenCalled();
  });

  it('sin estado en el cuerpo ya no reactiva la cuenta (antes ponía ACTIVO por defecto)', async () => {
    const res = await request(app).put('/api/usuarios/7').send({ nombres: 'Laura' });
    expect(res.status).toBe(200);
    expect('estado' in db.egresado.update.mock.calls[0][0].data).toBe(false);
  });
});

describe('DELETE /api/usuarios/:id', () => {
  it('responde 403 y no borra', async () => {
    const res = await request(appRutas).delete('/api/usuarios/7');
    expect(res.status).toBe(403);
    expect(db.egresado.delete).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/empresas/admin/:id', () => {
  it('responde 403 y no borra', async () => {
    const res = await request(appRutas).delete('/api/empresas/admin/7');
    expect(res.status).toBe(403);
    expect(db.empresa.delete).not.toHaveBeenCalled();
  });
});

describe('obtenerEmpresasParaAdmin (controlador de GET /api/empresas/admin/todas)', () => {
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

describe('actualizarEmpresaAdmin (controlador de PUT /api/empresas/admin/:id)', () => {
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
  it('sin token responde 403 y no cambia el estado', async () => {
    const res = await request(appRutas).put('/api/empresas/admin/estado/7').send({ estado: 'INACTIVO' });
    expect(res.status).toBe(403);
    expect(db.empresa.update).not.toHaveBeenCalled();
  });
});
