// Rutas de gestión que sólo puede usar la empresa dueña (2026-10):
// estado, anclaje y calificación de postulaciones, y edición del perfil propio.
// Prisma, Supabase y el correo están simulados: no hay base de datos, red ni envíos.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const { db, correo } = vi.hoisted(() => {
  process.env.JWT_SECRET = 'clave-solo-para-pruebas';
  return {
    db: {
      postulacion: { findUnique: vi.fn(), update: vi.fn() },
      notificacion: { create: vi.fn() },
      empresa: { update: vi.fn() },
    },
    correo: { enviarCorreoCambioEstado: vi.fn() },
  };
});
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => correo);

const { default: postulacionesRoutes } = await import('../src/routes/postulacionesRoutes.js');
const { default: empresaRoutes } = await import('../src/routes/empresaRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/empresas', empresaRoutes);

const PROHIBIDOS = ['password', 'resetToken', 'resetTokenExpiry', 'firebaseUid'];
const FINANCIEROS = ['annualRevenue', 'totalAssets', 'equity'];
const sinCampos = (obj, campos) => campos.filter((c) => c in obj);
const firmar = (payload) => `Bearer ${jwt.sign(payload, process.env.JWT_SECRET)}`;
const EMPRESA_DUENA = firmar({ id: 3, rol: 'empresa' });
const OTRA_EMPRESA = firmar({ id: 4, rol: 'empresa' });
const EGRESADO = firmar({ id: 3, rol: 'egresado' }); // mismo id numérico que la empresa

// Mismo simulador que fugas-publicas: devuelve sólo lo que pide la consulta.
const RELACIONES = new Set(['empresa', 'vacante', 'egresado', 'vacantes']);
const esRelacion = (fila, k) => RELACIONES.has(k) && typeof fila[k] === 'object' && fila[k] !== null;
const proyectar = (fila, { select, include } = {}) => {
  if (Array.isArray(fila)) return fila.map((f) => proyectar(f, { select, include }));
  if (select) {
    return Object.fromEntries(Object.entries(select).filter(([, v]) => v)
      .map(([k, v]) => [k, v === true ? (esRelacion(fila, k) ? proyectar(fila[k]) : fila[k]) : proyectar(fila[k], v)]));
  }
  const salida = Object.fromEntries(Object.entries(fila).filter(([k]) => !esRelacion(fila, k)));
  for (const [k, v] of Object.entries(include || {})) {
    if (v) salida[k] = proyectar(fila[k], v === true ? {} : v);
  }
  return salida;
};

const empresa = {
  id: 3, email: 'contacto@ejemplo.com', password: 'hash', resetToken: 'token-vigente', resetTokenExpiry: new Date(),
  nombre: 'Agro Andes', phones: '601', contactName: 'Ana', descripcion: 'Sobre nosotros', beneficios: 'Bienestar',
  sitioWeb: 'https://ejemplo.com', linkedin: 'https://linkedin.com/company/ejemplo', visibilidad: { beneficios: true },
  nit: '900', modalidad: 'Híbrido', address: 'Calle 1', city: 'Fusagasugá', department: 'Cundinamarca',
  companyType: 'SAS', economicSector: ['Agro'], foundationYear: 2001, employees: '10',
  annualRevenue: '1', totalAssets: '2', equity: '3', distributionChannels: ['Directo'], mainClients: 'Mayoristas',
  emailAuthorization: true, createdAt: new Date('2026-01-01'), estado: 'ACTIVO', updatedAt: new Date('2026-01-01'),
};
const egresado = {
  id: 7, nombres: 'Laura', apellidos: 'Gómez', correo: 'laura@ejemplo.com', celular: '3000000000',
  password: 'hash', resetToken: 'token-vigente', resetTokenExpiry: new Date(), firebaseUid: 'uid',
};
const postulacion = {
  id: 11, telefono: '3000000000', estado: 'PENDIENTE', anclado: false, chatActivo: true,
  fecha: new Date('2026-02-01'), calificacionAdmin: 0, comentarioAdmin: null, vacanteId: 5, egresadoId: 7,
  egresado, vacante: { id: 5, titulo: 'Analista', empresaId: 3, empresa },
};

beforeEach(() => {
  vi.clearAllMocks();
  db.postulacion.findUnique.mockImplementation(async (args) => (args.where.id === 11 ? proyectar(postulacion, args) : null));
  db.postulacion.update.mockImplementation(async ({ data, ...args }) => proyectar({ ...postulacion, ...data }, args));
  db.empresa.update.mockImplementation(async ({ data, ...args }) => proyectar({ ...empresa, ...data }, args));
  db.notificacion.create.mockResolvedValue({});
});

// Las tres rutas de gestión de postulaciones comparten el mismo control de acceso.
const RUTAS = [
  ['PUT /api/postulaciones/:id/estado', (id) => `/api/postulaciones/${id}/estado`, { estado: 'ENTREVISTA' }],
  ['PUT /api/postulaciones/:id/anclaje', (id) => `/api/postulaciones/${id}/anclaje`, { anclado: true }],
  ['PUT /api/postulaciones/calificar/:id', (id) => `/api/postulaciones/calificar/${id}`, { calificacion: 4, comentario: 'Buen perfil' }],
];

describe.each(RUTAS)('%s', (_, ruta, cuerpo) => {
  it('sin token responde 403 y no escribe', async () => {
    const res = await request(app).put(ruta(11)).send(cuerpo);
    expect(res.status).toBe(403);
    expect(db.postulacion.update).not.toHaveBeenCalled();
  });

  it('con token de egresado responde 403 y no escribe', async () => {
    const res = await request(app).put(ruta(11)).set('Authorization', EGRESADO).send(cuerpo);
    expect(res.status).toBe(403);
    expect(db.postulacion.update).not.toHaveBeenCalled();
  });

  it('otra empresa recibe el mismo 404 que una postulación inexistente', async () => {
    const ajena = await request(app).put(ruta(11)).set('Authorization', OTRA_EMPRESA).send(cuerpo);
    const inexistente = await request(app).put(ruta(999)).set('Authorization', OTRA_EMPRESA).send(cuerpo);
    expect(ajena.status).toBe(404);
    expect(inexistente.status).toBe(404);
    expect(ajena.body).toEqual(inexistente.body);
    expect(db.postulacion.update).not.toHaveBeenCalled();
  });

  it('la empresa dueña sí puede, y la respuesta no trae datos del egresado', async () => {
    const res = await request(app).put(ruta(11)).set('Authorization', EMPRESA_DUENA).send(cuerpo);
    expect(res.status).toBe(200);
    expect(db.postulacion.update).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(res.body)).not.toMatch(/laura@ejemplo\.com|token-vigente|"hash"|3000000000/);
  });
});

describe('PUT /api/postulaciones/:id/estado (detalle)', () => {
  it('responde sólo { id, estado } y sigue enviando el correo de aviso', async () => {
    const res = await request(app).put('/api/postulaciones/11/estado').set('Authorization', EMPRESA_DUENA).send({ estado: 'entrevista' });
    expect(res.body).toEqual({ id: 11, estado: 'ENTREVISTA' });
    expect(correo.enviarCorreoCambioEstado).toHaveBeenCalledWith('laura@ejemplo.com', 'Laura', 'Analista', 'ENTREVISTA', 'Agro Andes', 11);
    expect(db.notificacion.create.mock.calls[0][0].data).toMatchObject({ egresadoId: 7, postulacionId: 11 });
    const { egresado: consulta } = db.postulacion.update.mock.calls[0][0].include;
    expect(consulta).toEqual({ select: { nombres: true, correo: true } });
  });
});

describe('PUT /api/empresas/:id (perfil propio)', () => {
  // Lo que envía PerfilEmpresa: el perfil recibido del GET, con sus ediciones.
  const cuerpoPerfil = {
    id: 3, nombre: 'Agro Andes', nit: '900', phones: '602', contactName: 'Ana María', address: 'Calle 2', city: 'Girardot',
    department: 'Cundinamarca', companyType: 'SAS', economicSector: 'Agro, Minería', foundationYear: '2001', employees: '12',
    mainClients: 'Mayoristas', modalidad: 'Remoto', descripcion: 'Nueva', beneficios: 'Bienestar', sitioWeb: 'https://ejemplo.com',
    linkedin: 'https://linkedin.com/company/ejemplo', visibilidad: { beneficios: false }, vacantes: [{ id: 5, postulaciones: [] }],
  };

  it('sin token responde 403', async () => {
    const res = await request(app).put('/api/empresas/3').send(cuerpoPerfil);
    expect(res.status).toBe(403);
    expect(db.empresa.update).not.toHaveBeenCalled();
  });

  it('otra empresa no puede editar este registro', async () => {
    const res = await request(app).put('/api/empresas/3').set('Authorization', OTRA_EMPRESA).send(cuerpoPerfil);
    expect(res.status).toBe(403);
    expect(db.empresa.update).not.toHaveBeenCalled();
  });

  it('un egresado con el mismo id numérico tampoco', async () => {
    const res = await request(app).put('/api/empresas/3').set('Authorization', EGRESADO).send(cuerpoPerfil);
    expect(res.status).toBe(403);
    expect(db.empresa.update).not.toHaveBeenCalled();
  });

  it('la dueña guarda lo que envía PerfilEmpresa; estado, email y secretos se ignoran', async () => {
    const res = await request(app).put('/api/empresas/3').set('Authorization', EMPRESA_DUENA).send({
      ...cuerpoPerfil,
      estado: 'ACTIVO', email: 'otro@ejemplo.com', password: 'x', resetToken: 'conocido', resetTokenExpiry: '2099-01-01',
      annualRevenue: '999', createdAt: '2020-01-01',
    });
    expect(res.status).toBe(200);
    const { data, where } = db.empresa.update.mock.calls[0][0];
    expect(where).toEqual({ id: 3 });
    expect(Object.keys(data).sort()).toEqual([
      'address', 'beneficios', 'city', 'companyType', 'contactName', 'department', 'descripcion', 'economicSector',
      'employees', 'foundationYear', 'linkedin', 'mainClients', 'modalidad', 'phones', 'sitioWeb', 'visibilidad',
    ]);
    expect(data.foundationYear).toBe(2001);
    expect(data.economicSector).toEqual(['Agro', 'Minería']);
    expect(sinCampos(res.body.empresa, [...PROHIBIDOS, ...FINANCIEROS, 'email'])).toEqual([]);
  });
});
