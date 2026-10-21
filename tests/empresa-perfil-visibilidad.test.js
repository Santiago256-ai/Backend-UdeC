// Contención 2 (2026-10): GET /api/empresas/:id. Quien no es la dueña (rol
// empresa y mismo id) recibe el perfil sin las secciones que la empresa ocultó en
// `visibilidad`, y de cada postulación sólo ve su propio egresadoId (las demás en
// null, conservando cuántas son). Prisma está simulado.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { proyectar, firmar, EMPRESA_DUENA, OTRA_EMPRESA, EGRESADO_MISMO_ID } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({ empresa: { findUnique: vi.fn() } }));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));

const { default: empresaRoutes } = await import('../src/routes/empresaRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/empresas', empresaRoutes);

// Lo que cada interruptor de PerfilEmpresa oculta (economicSector no: el
// encabezado de VerPerfilEmpresa lo muestra siempre).
const OCULTABLES = {
  sobreNosotros: ['descripcion'],
  detallesEmpresa: ['companyType', 'employees', 'modalidad', 'foundationYear'],
  beneficios: ['beneficios'],
  ubicacion: ['address', 'city', 'department'],
  presenciaDigital: ['sitioWeb', 'linkedin'],
  contacto: ['contactName', 'phones'],
  infoComercial: ['mainClients'],
};
const TODO_OCULTO = Object.fromEntries(Object.keys(OCULTABLES).map((s) => [s, false]));
const CAMPOS_OCULTABLES = Object.values(OCULTABLES).flat();

const empresaCon = (visibilidad) => ({
  id: 3, email: 'contacto@ejemplo.com', password: 'hash', nombre: 'Agro Andes', nit: '900',
  phones: '601', contactName: 'Ana', address: 'Calle 1', city: 'Fusagasugá', department: 'Cundinamarca',
  companyType: 'SAS', economicSector: ['Agro'], foundationYear: 2001, employees: '10', mainClients: 'Mayoristas',
  modalidad: 'Híbrido', descripcion: 'Sobre nosotros', beneficios: 'Bienestar',
  sitioWeb: 'https://ejemplo.com', linkedin: 'https://linkedin.com/company/ejemplo', visibilidad,
  vacantes: [{
    id: 5, titulo: 'Analista', estado: 'ABIERTA', empresaId: 3,
    postulaciones: [
      { id: 11, egresadoId: 7, telefono: '3000000000' },
      { id: 12, egresadoId: 3, telefono: '3000000001' },
      { id: 13, egresadoId: 9, telefono: '3000000002' },
    ],
  }],
});

let empresa;
beforeEach(() => {
  vi.clearAllMocks();
  empresa = empresaCon(TODO_OCULTO);
  db.empresa.findUnique.mockImplementation(async (args) => proyectar(empresa, args));
});

const pedir = (token) => request(app).get('/api/empresas/3').set('Authorization', token());
const egresadoIds = (res) => res.body.vacantes[0].postulaciones.map((p) => p.egresadoId);

describe('GET /api/empresas/:id para quien no es la dueña', () => {
  it('un egresado no recibe las secciones ocultas, pero sí nombre, sector y visibilidad', async () => {
    const res = await pedir(() => firmar({ id: 7, rol: 'egresado' }));
    expect(res.status).toBe(200);
    expect(CAMPOS_OCULTABLES.filter((c) => c in res.body)).toEqual([]);
    expect(res.body).toMatchObject({ id: 3, nombre: 'Agro Andes', economicSector: ['Agro'], visibilidad: TODO_OCULTO });
  });

  it('un egresado sólo ve su propio egresadoId; los demás en null y el conteo se conserva', async () => {
    const res = await pedir(() => firmar({ id: 7, rol: 'egresado' }));
    expect(egresadoIds(res)).toEqual([7, null, null]);
  });

  it('un egresado con el mismo id numérico que la empresa recibe la versión filtrada', async () => {
    const res = await pedir(EGRESADO_MISMO_ID);
    expect(res.status).toBe(200);
    expect(CAMPOS_OCULTABLES.filter((c) => c in res.body)).toEqual([]);
    expect(egresadoIds(res)).toEqual([null, 3, null]);
  });

  it('otra empresa recibe la versión filtrada y ningún egresadoId', async () => {
    const res = await pedir(OTRA_EMPRESA);
    expect(CAMPOS_OCULTABLES.filter((c) => c in res.body)).toEqual([]);
    expect(egresadoIds(res)).toEqual([null, null, null]);
  });

  it('cada interruptor oculta sólo sus campos', async () => {
    for (const [seccion, campos] of Object.entries(OCULTABLES)) {
      empresa = empresaCon({ [seccion]: false });
      const res = await pedir(() => firmar({ id: 7, rol: 'egresado' }));
      expect(CAMPOS_OCULTABLES.filter((c) => !(c in res.body))).toEqual(campos);
    }
  });

  it('sin visibilidad guardada todo es público (igual que en el frontend)', async () => {
    empresa = empresaCon(null);
    const res = await pedir(() => firmar({ id: 7, rol: 'egresado' }));
    expect(CAMPOS_OCULTABLES.filter((c) => !(c in res.body))).toEqual([]);
  });
});

describe('GET /api/empresas/:id para la dueña', () => {
  it('recibe todos sus campos y todos los egresadoId', async () => {
    const res = await pedir(EMPRESA_DUENA);
    expect(res.status).toBe(200);
    expect(CAMPOS_OCULTABLES.filter((c) => !(c in res.body))).toEqual([]);
    expect(egresadoIds(res)).toEqual([7, 3, 9]);
  });

  it('las postulaciones siguen sin teléfono (sólo id y egresadoId)', async () => {
    const res = await pedir(EMPRESA_DUENA);
    expect(Object.keys(res.body.vacantes[0].postulaciones[0]).sort()).toEqual(['egresadoId', 'id']);
  });
});
