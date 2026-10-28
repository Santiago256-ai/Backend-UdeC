// Ronda del panel de administración (2026-10): las 8 rutas del panel exigen
// sesión de administrador activa (requireRol("admin")). Cuenta desactivada o
// eliminada: 401 { codigo: "sesion_invalida" }. Cada respuesta lleva sólo lo que
// lee el panel, nunca el hash de la contraseña ni tokens. Los DELETE del panel
// siguen deshabilitados y detalle-completo ya no existe.
// Prisma, Supabase y el correo están simulados: no hay base de datos, red ni envíos.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import {
  proyectar, sinCampos, PROHIBIDOS, egresadoCompleto, postulacionCompleta,
  firmar, firmarAdmin, TOKEN_ADMIN,
} from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  egresado: { findMany: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
  empresa: { findMany: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn() },
  vacante: { findMany: vi.fn(), groupBy: vi.fn() },
  postulacion: { findMany: vi.fn(), count: vi.fn(), groupBy: vi.fn() },
  administrador: { findUnique: vi.fn() },
}));
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

const FINANCIEROS = ['annualRevenue', 'totalAssets', 'equity'];
const SECRETOS = [...PROHIBIDOS, ...FINANCIEROS, 'telefono'];

const empresaCompleta = () => ({
  id: 3, nombre: 'Agro Andes', nit: '900', email: 'contacto@ejemplo.com', phones: '601', contactName: 'Ana',
  address: 'Calle 1', city: 'Fusagasugá', economicSector: ['Agro'], employees: '10', estado: 'ACTIVO',
  createdAt: new Date('2026-01-01'), password: 'hash', resetToken: 'token-vigente', resetTokenExpiry: new Date(),
  annualRevenue: '1', totalAssets: '2', equity: '3', visibilidad: {}, _count: { vacantes: 1 },
});
const vacanteCompleta = () => ({
  id: 5, titulo: 'Analista', descripcion: '<p>Funciones</p>', ubicacion: 'Fusagasugá', tipo: 'Indefinido',
  jornada: 'Completa', modalidad: 'Presencial', tipoSalario: 'Fijo', salario: '2000000', horario: 'L-V',
  fechaCreacion: new Date('2026-01-15'), fechaCierre: null, limitePostulantes: null, estado: 'ABIERTA',
  empresaId: 3, updatedAt: new Date('2026-01-20'),
  empresa: empresaCompleta(), _count: { postulaciones: 1 },
});
const egresadoConConteo = () => ({ ...egresadoCompleto(), _count: { postulaciones: 2 } });
const postulacionConEmpresa = () => {
  const p = postulacionCompleta();
  return { ...p, vacante: { ...p.vacante, empresa: empresaCompleta() } };
};

const ADMIN_ACTIVO = { id: 1, usuario: 'admin.ops', nombre: 'Oficina de Egresados', activo: true };
let cuentaAdmin;

const prismaNoEncontrado = () => Object.assign(new Error('no encontrado'), { code: 'P2025' });

beforeEach(() => {
  vi.clearAllMocks();
  cuentaAdmin = ADMIN_ACTIVO;
  db.administrador.findUnique.mockImplementation(async () => cuentaAdmin);
  db.egresado.findMany.mockImplementation(async (args) => proyectar([egresadoConConteo()], args));
  db.egresado.update.mockImplementation(async (args) => proyectar({ ...egresadoCompleto(), ...args.data }, args));
  db.empresa.findMany.mockImplementation(async (args) => proyectar([empresaCompleta()], args));
  db.empresa.update.mockImplementation(async (args) => proyectar({ ...empresaCompleta(), ...args.data }, args));
  db.vacante.findMany.mockImplementation(async (args) => proyectar([vacanteCompleta()], args));
  db.postulacion.findMany.mockImplementation(async (args) => proyectar([postulacionConEmpresa()], args));
  db.egresado.count.mockResolvedValue(10);
  db.empresa.count.mockResolvedValue(4);
  db.postulacion.count.mockResolvedValue(2);
  db.postulacion.groupBy.mockResolvedValue([{ estado: 'PENDIENTE', _count: { _all: 2 } }]);
  db.vacante.groupBy.mockResolvedValue([{ modalidad: 'Presencial', _count: { _all: 1 } }]);
  db.egresado.groupBy.mockResolvedValue([{ facultad: 'Ingeniería', _count: { _all: 10 } }]);
});

const consultasDeDatos = () => Object.entries(db)
  .filter(([modelo]) => modelo !== 'administrador')
  .flatMap(([, metodos]) => Object.values(metodos))
  .reduce((total, fn) => total + fn.mock.calls.length, 0);

const pedir = (metodo, ruta, token, cuerpo) => {
  let peticion = request(app)[metodo](ruta);
  if (token) peticion = peticion.set('Authorization', token());
  return cuerpo ? peticion.send(cuerpo) : peticion;
};

// Las 8 rutas que el panel vuelve a usar, con el cuerpo que envía.
const RUTAS = [
  ['get', '/api/usuarios/admin/todos'],
  ['put', '/api/usuarios/7', { nombres: 'Laura', estado: 'ACTIVO' }],
  ['get', '/api/empresas/admin/todas'],
  ['put', '/api/empresas/admin/estado/3', { estado: 'INACTIVO' }],
  ['put', '/api/empresas/admin/3', { nombre: 'Agro Andes SAS' }],
  ['get', '/api/postulaciones/admin/todas'],
  ['get', '/api/vacantes/admin/todas'],
  ['get', '/api/vacantes/stats'],
];

describe.each(RUTAS)('%s %s', (metodo, ruta, cuerpo) => {
  it('sin token responde 403 y no consulta', async () => {
    const res = await pedir(metodo, ruta, null, cuerpo);
    expect(res.status).toBe(403);
    expect(consultasDeDatos()).toBe(0);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it.each([
    ['egresado', () => firmar({ id: 1, rol: 'egresado' })],
    ['empresa', () => firmar({ id: 1, rol: 'empresa' })],
  ])('con token de %s (mismo número que el administrador) responde 403 y no consulta', async (_, token) => {
    const res = await pedir(metodo, ruta, token, cuerpo);
    expect(res.status).toBe(403);
    expect(consultasDeDatos()).toBe(0);
    expect(db.administrador.findUnique).not.toHaveBeenCalled();
  });

  it('con rol "admin" pero sin aud "admin" responde 403', async () => {
    const res = await pedir(metodo, ruta, () => firmar({ id: 1, rol: 'admin' }), cuerpo);
    expect(res.status).toBe(403);
    expect(consultasDeDatos()).toBe(0);
  });

  it('cuenta desactivada o eliminada: el mismo 401 sesion_invalida, sin consultar datos', async () => {
    cuentaAdmin = { ...ADMIN_ACTIVO, activo: false };
    const desactivada = await pedir(metodo, ruta, TOKEN_ADMIN, cuerpo);
    cuentaAdmin = null;
    const eliminada = await pedir(metodo, ruta, TOKEN_ADMIN, cuerpo);
    for (const res of [desactivada, eliminada]) {
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ codigo: 'sesion_invalida' });
    }
    expect(consultasDeDatos()).toBe(0);
  });

  it('con sesión de administrador activa responde 200, sin secretos en ninguna parte', async () => {
    const res = await pedir(metodo, ruta, TOKEN_ADMIN, cuerpo);
    expect(res.status).toBe(200);
    expect(db.administrador.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 1 } }));
    const texto = JSON.stringify(res.body);
    for (const campo of SECRETOS) expect(texto).not.toContain(`"${campo}"`);
  });
});

describe('respuestas de los listados (lo que lee el panel)', () => {
  it('GET /api/usuarios/admin/todos: los campos de ItemUsuarios y el conteo', async () => {
    const res = await pedir('get', '/api/usuarios/admin/todos', TOKEN_ADMIN);
    expect(Object.keys(res.body[0]).sort()).toEqual([
      '_count', 'apellidos', 'celular', 'correo', 'createdAt', 'estado', 'facultad', 'id', 'nombres', 'programa',
    ]);
    expect(res.body[0]._count).toEqual({ postulaciones: 2 });
  });

  it('GET /api/empresas/admin/todas: los campos de ItemEmpresas y del modal de detalle', async () => {
    const res = await pedir('get', '/api/empresas/admin/todas', TOKEN_ADMIN);
    expect(Object.keys(res.body[0]).sort()).toEqual([
      '_count', 'address', 'city', 'contactName', 'createdAt', 'economicSector', 'email', 'employees', 'estado',
      'id', 'nit', 'nombre', 'phones',
    ]);
    expect(res.body[0]._count).toEqual({ vacantes: 1 });
  });

  it('GET /api/postulaciones/admin/todas: los campos de ItemPostulaciones, sin la fila completa', async () => {
    const res = await pedir('get', '/api/postulaciones/admin/todas', TOKEN_ADMIN);
    const p = res.body[0];
    expect(Object.keys(p).sort()).toEqual(['calificacionAdmin', 'comentarioAdmin', 'egresado', 'estado', 'fecha', 'id', 'vacante']);
    expect(Object.keys(p.egresado).sort()).toEqual(['apellidos', 'correo', 'nombres']);
    expect(p.vacante).toEqual({ titulo: 'Analista', empresa: { nombre: 'Agro Andes' } });
    expect(sinCampos(p, ['telefono', 'chatActivo', 'anclado', 'vacanteId', 'egresadoId'])).toEqual([]);
  });

  it('GET /api/vacantes/admin/todas: los campos de ItemVacantes y del Inicio, sin la vacante entera ni el NIT', async () => {
    const res = await pedir('get', '/api/vacantes/admin/todas', TOKEN_ADMIN);
    expect(res.body[0]).toEqual({ id: 5, titulo: 'Analista', ubicacion: 'Fusagasugá', estado: 'ABIERTA', empresa: { nombre: 'Agro Andes' } });
  });

  it('GET /api/vacantes/stats: los KPI y gráficos que leen el Inicio y Métricas', async () => {
    const res = await pedir('get', '/api/vacantes/stats', TOKEN_ADMIN);
    expect(Object.keys(res.body).sort()).toEqual([
      'datosCrecimiento', 'egresadosPorFacultad', 'empresasRecientes', 'postulacionesHoy', 'postulacionesPorEstado',
      'totalEgresados', 'totalEmpresas', 'vacantesActivas', 'vacantesFinalizadas', 'vacantesPorModalidad', 'vacantesPorSector',
    ]);
    expect(res.body).toMatchObject({ totalEgresados: 10, totalEmpresas: 4, postulacionesHoy: 2, vacantesActivas: 1 });
  });

  it('GET /api/vacantes/stats: un error de base no devuelve el mensaje interno', async () => {
    db.egresado.count.mockRejectedValue(new Error('detalle interno de la base'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await pedir('get', '/api/vacantes/stats', TOKEN_ADMIN);
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain('detalle interno');
    expect('detalle' in res.body).toBe(false);
  });
});

describe('PUT /api/usuarios/:id con sesión de administrador', () => {
  it('escribe sólo los campos editables y el estado: nunca correo, password, tokens, rol ni id', async () => {
    const res = await pedir('put', '/api/usuarios/7', TOKEN_ADMIN, {
      ...egresadoCompleto(), nombres: 'Laura M.', estado: 'INACTIVO', rol: 'admin', id: 99, correo: 'otro@ejemplo.com',
    });
    expect(res.status).toBe(200);
    const { data, where } = db.egresado.update.mock.calls[0][0];
    expect(where).toEqual({ id: 7 });
    expect(Object.keys(data).sort()).toEqual(['apellidos', 'celular', 'estado', 'facultad', 'nombres', 'programa']);
    expect(data.estado).toBe('INACTIVO');
  });

  it('estado no válido: 400 sin escribir', async () => {
    const res = await pedir('put', '/api/usuarios/7', TOKEN_ADMIN, { estado: 'ELIMINADO' });
    expect(res.status).toBe(400);
    expect(db.egresado.update).not.toHaveBeenCalled();
  });

  it('id no numérico e inexistente: el mismo 404', async () => {
    const noNumerico = await pedir('put', '/api/usuarios/abc', TOKEN_ADMIN, { nombres: 'X' });
    expect(db.egresado.update).not.toHaveBeenCalled();
    db.egresado.update.mockRejectedValue(prismaNoEncontrado());
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const inexistente = await pedir('put', '/api/usuarios/999', TOKEN_ADMIN, { nombres: 'X' });
    for (const res of [noNumerico, inexistente]) expect(res.status).toBe(404);
    expect(noNumerico.body).toEqual(inexistente.body);
  });
});

describe('PUT /api/empresas/admin/estado/:id con sesión de administrador', () => {
  it('ACTIVO o INACTIVO: escribe sólo el estado', async () => {
    const res = await pedir('put', '/api/empresas/admin/estado/3', TOKEN_ADMIN, { estado: 'INACTIVO', email: 'x@y.co' });
    expect(res.status).toBe(200);
    expect(db.empresa.update.mock.calls[0][0]).toMatchObject({ where: { id: 3 }, data: { estado: 'INACTIVO' } });
    expect(Object.keys(db.empresa.update.mock.calls[0][0].data)).toEqual(['estado']);
  });

  it.each([[{}], [{ estado: 'BORRADA' }], [{ estado: 'inactivo' }], [{ estado: null }]])(
    'cuerpo %j: 400 sin escribir', async (cuerpo) => {
      const res = await pedir('put', '/api/empresas/admin/estado/3', TOKEN_ADMIN, cuerpo);
      expect(res.status).toBe(400);
      expect(db.empresa.update).not.toHaveBeenCalled();
    });

  it('id no numérico e inexistente: el mismo 404 (antes 500)', async () => {
    const noNumerico = await pedir('put', '/api/empresas/admin/estado/3abc', TOKEN_ADMIN, { estado: 'ACTIVO' });
    expect(db.empresa.update).not.toHaveBeenCalled();
    db.empresa.update.mockRejectedValue(prismaNoEncontrado());
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const inexistente = await pedir('put', '/api/empresas/admin/estado/999', TOKEN_ADMIN, { estado: 'ACTIVO' });
    for (const res of [noNumerico, inexistente]) expect(res.status).toBe(404);
    expect(noNumerico.body).toEqual(inexistente.body);
  });
});

describe('PUT /api/empresas/admin/:id con sesión de administrador', () => {
  it('sólo los campos editables del modal', async () => {
    const res = await pedir('put', '/api/empresas/admin/3', TOKEN_ADMIN, { ...empresaCompleta(), nombre: 'Agro Andes SAS', id: 99 });
    expect(res.status).toBe(200);
    const { data, where } = db.empresa.update.mock.calls[0][0];
    expect(where).toEqual({ id: 3 });
    expect(Object.keys(data).sort()).toEqual(['address', 'city', 'contactName', 'economicSector', 'employees', 'nit', 'nombre', 'phones']);
  });

  it('id no numérico e inexistente: el mismo 404 (antes 500)', async () => {
    const noNumerico = await pedir('put', '/api/empresas/admin/abc', TOKEN_ADMIN, { nombre: 'X' });
    expect(db.empresa.update).not.toHaveBeenCalled();
    db.empresa.update.mockRejectedValue(prismaNoEncontrado());
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const inexistente = await pedir('put', '/api/empresas/admin/999', TOKEN_ADMIN, { nombre: 'X' });
    for (const res of [noNumerico, inexistente]) expect(res.status).toBe(404);
    expect(noNumerico.body).toEqual(inexistente.body);
  });
});

describe('lo que sigue cerrado con sesión de administrador', () => {
  it.each([
    ['/api/usuarios/7', 'egresado'],
    ['/api/empresas/admin/3', 'empresa'],
  ])('DELETE %s sigue deshabilitado (403 temporal) y no borra', async (ruta, modelo) => {
    const res = await pedir('delete', ruta, TOKEN_ADMIN);
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/deshabilitada temporalmente/);
    expect(db[modelo].delete).not.toHaveBeenCalled();
  });

  it('GET /api/postulaciones/admin/detalle-completo/:vacanteId ya no existe (404)', async () => {
    const res = await pedir('get', '/api/postulaciones/admin/detalle-completo/5', TOKEN_ADMIN);
    expect(res.status).toBe(404);
    expect(consultasDeDatos()).toBe(0);
  });

  it('un token de administrador con otro sub consulta esa cuenta, no la 1', async () => {
    await pedir('get', '/api/vacantes/stats', () => firmarAdmin({}, { subject: '8' }));
    expect(db.administrador.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 8 } }));
  });
});
