// Contención de las rutas públicas que exponían secretos (2026-10).
// Prisma, Supabase y el correo están simulados: no hay base de datos, red ni
// envíos. Se montan sólo las rutas tocadas sobre un Express de prueba.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const db = vi.hoisted(() => {
  process.env.JWT_SECRET = 'clave-solo-para-pruebas';
  return {
    vacante: { findMany: vi.fn() },
    postulacion: { findMany: vi.fn() },
    empresa: { findUnique: vi.fn() },
  };
});
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => ({ enviarCorreoCambioEstado: vi.fn() }));

const { default: vacantesRoutes } = await import('../src/routes/vacantesRoutes.js');
const { default: postulacionesRoutes } = await import('../src/routes/postulacionesRoutes.js');
const { default: empresaRoutes } = await import('../src/routes/empresaRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/vacantes', vacantesRoutes);
app.use('/api/postulaciones', postulacionesRoutes);
app.use('/api/empresas', empresaRoutes);

const PROHIBIDOS = ['password', 'resetToken', 'resetTokenExpiry', 'firebaseUid'];
const FINANCIEROS = ['annualRevenue', 'totalAssets', 'equity'];
const sinCampos = (obj, campos) => campos.filter((c) => c in obj);

// Registros completos, como los guarda la base. El simulador devuelve sólo lo
// que la consulta pide (select / include), igual que Prisma: si alguien vuelve a
// pedir el registro entero, las pruebas lo ven.
const RELACIONES = new Set([
  'empresa', 'vacante', 'vacantes', 'postulaciones', 'egresado', 'cv',
  'educacion', 'experiencia', 'aptitudes', 'idiomas', 'referencias', '_count',
]);
// (dentro de _count las "relaciones" son números: se tratan como escalares)
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

const egresado = {
  id: 7, nombres: 'Laura', apellidos: 'Gómez', correo: 'laura@ejemplo.com', celular: '3000000000',
  facultad: 'Ingeniería', programa: 'Sistemas', estado: 'ACTIVO', createdAt: new Date('2026-01-01'),
  password: 'hash', resetToken: 'token-vigente', resetTokenExpiry: new Date(), firebaseUid: 'uid',
  cv: {
    id: 1, egresadoId: 7, celular: '3000000000', descripcion: 'Perfil', direccion: 'Calle 1', habilidades: [],
    educacion: [{ id: 1, titulo: 'Ingeniería de Sistemas' }], experiencia: [], aptitudes: [], idiomas: [], referencias: [],
  },
};
const postulacion = {
  id: 11, telefono: '3000000000', estado: 'PENDIENTE', anclado: false, chatActivo: true,
  fecha: new Date('2026-02-01'), fechaActualizacion: new Date('2026-02-01'),
  calificacionAdmin: 4, comentarioAdmin: 'nota interna', vacanteId: 5, egresadoId: 7, egresado,
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
const vacante = {
  id: 5, titulo: 'Analista', descripcion: 'Descripción', ubicacion: 'Fusagasugá', tipo: 'Indefinido',
  jornada: 'Completa', modalidad: 'Híbrido', tipoSalario: 'Básico', salario: '2000000', horario: 'L-V',
  fechaCreacion: new Date('2026-01-15'), fechaCierre: null, limitePostulantes: null, estado: 'ABIERTA',
  empresaId: 3, updatedAt: new Date('2026-01-15'),
  empresa, postulaciones: [postulacion], _count: { postulaciones: 1 },
};
empresa.vacantes = [vacante];

beforeEach(() => {
  vi.clearAllMocks();
  db.vacante.findMany.mockImplementation(async (args) => proyectar([vacante], args));
  db.postulacion.findMany.mockImplementation(async (args) => proyectar([postulacion], args));
  db.empresa.findUnique.mockImplementation(async (args) => proyectar(empresa, args));
});

describe('GET /api/vacantes (feed público de egresados)', () => {
  it('de la empresa sólo devuelve id y nombre; nada de secretos ni datos financieros', async () => {
    const res = await request(app).get('/api/vacantes');
    expect(res.status).toBe(200);
    const { empresa: emp } = res.body[0];
    expect(Object.keys(emp).sort()).toEqual(['id', 'nombre']);
    expect(sinCampos(emp, [...PROHIBIDOS, ...FINANCIEROS, 'email'])).toEqual([]);
  });

  it('mantiene lo que lee el frontend: postulaciones resumidas, _count y datos de la vacante', async () => {
    const res = await request(app).get('/api/vacantes');
    const v = res.body[0];
    expect(v.titulo).toBe('Analista');
    expect(v.empresaId).toBe(3);
    expect(v._count).toEqual({ postulaciones: 1 });
    expect(Object.keys(v.postulaciones[0]).sort()).toEqual(['egresadoId', 'estado', 'fecha', 'id']);
  });
});

describe('GET /api/postulaciones/vacante/:vacanteId', () => {
  it('el egresado sale sin password, resetToken, resetTokenExpiry ni firebaseUid', async () => {
    const res = await request(app).get('/api/postulaciones/vacante/5');
    expect(res.status).toBe(200);
    expect(sinCampos(res.body[0].egresado, PROHIBIDOS)).toEqual([]);
  });

  it('mantiene lo que leen la tabla, el chat y VerCV', async () => {
    const res = await request(app).get('/api/postulaciones/vacante/5');
    const p = res.body[0];
    expect(p).toMatchObject({ id: 11, estado: 'PENDIENTE', anclado: false, vacanteId: 5, egresadoId: 7 });
    expect(p.egresado).toMatchObject({ id: 7, nombres: 'Laura', apellidos: 'Gómez', correo: 'laura@ejemplo.com' });
    expect(p.egresado.cv.educacion).toHaveLength(1);
    expect(p.egresado.cv).toHaveProperty('experiencia');
  });
});

describe('GET /api/empresas/:id', () => {
  const token = jwt.sign({ id: 99, rol: 'egresado' }, process.env.JWT_SECRET);

  it('sigue pidiendo token (no se abre más de lo que estaba)', async () => {
    const res = await request(app).get('/api/empresas/3');
    expect(res.status).toBe(403);
    expect(db.empresa.findUnique).not.toHaveBeenCalled();
  });

  it('no devuelve email, secretos ni datos financieros', async () => {
    const res = await request(app).get('/api/empresas/3').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(sinCampos(res.body, [...PROHIBIDOS, ...FINANCIEROS, 'email'])).toEqual([]);
  });

  it('de las postulaciones de cada vacante sólo devuelve id y egresadoId (sin teléfono ni notas)', async () => {
    const res = await request(app).get('/api/empresas/3').set('Authorization', `Bearer ${token}`);
    expect(Object.keys(res.body.vacantes[0].postulaciones[0]).sort()).toEqual(['egresadoId', 'id']);
  });

  it('mantiene los campos que leen PerfilEmpresa y VerPerfilEmpresa', async () => {
    const res = await request(app).get('/api/empresas/3').set('Authorization', `Bearer ${token}`);
    for (const campo of [
      'id', 'nombre', 'nit', 'phones', 'contactName', 'address', 'city', 'department', 'companyType', 'economicSector',
      'foundationYear', 'employees', 'mainClients', 'modalidad', 'descripcion', 'beneficios', 'sitioWeb', 'linkedin', 'visibilidad',
    ]) expect(res.body).toHaveProperty(campo);
    expect(res.body.vacantes[0]).toMatchObject({ id: 5, titulo: 'Analista', ubicacion: 'Fusagasugá', estado: 'ABIERTA' });
  });
});
