// Ronda "dueño", entrega 3 (2026-10): notificaciones del egresado, vacantes por
// empresa y el feed de vacantes. Se comprueban el rol Y el id del token (los ids
// se repiten entre egresados, empresas y administradores). Ajeno, inexistente o
// id no numérico: el mismo 404, sin escribir.
// El simulador aplica los `where` de pertenencia, así que una notificación ajena
// no se toca aunque el controlador la pida. Prisma, Supabase y el correo están
// simulados: no hay base de datos, red ni envíos.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { proyectar, firmar, TOKEN_ADMIN } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  notificacion: { findMany: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn(), update: vi.fn(), delete: vi.fn() },
  vacante: { findMany: vi.fn() },
  administrador: { findUnique: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => ({ enviarCorreoCambioEstado: vi.fn() }));

const { default: notificacionRoutes } = await import('../src/routes/notificacionRoutes.js');
const { default: vacantesRoutes } = await import('../src/routes/vacantesRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/vacantes', vacantesRoutes);

const EGRESADO_7 = () => firmar({ id: 7, rol: 'egresado' });
const EGRESADO_8 = () => firmar({ id: 8, rol: 'egresado' });
const EMPRESA_3 = () => firmar({ id: 3, rol: 'empresa' });
const EMPRESA_4 = () => firmar({ id: 4, rol: 'empresa' });
const EMPRESA_7 = () => firmar({ id: 7, rol: 'empresa' }); // mismo número que el egresado 7
const EGRESADO_3 = () => firmar({ id: 3, rol: 'egresado' }); // mismo número que la empresa 3

const pedir = (metodo, ruta, token) => {
  const peticion = request(app)[metodo](ruta);
  return token ? peticion.set('Authorization', token()) : peticion;
};

// --- Notificaciones -------------------------------------------------------------
// 21: del egresado 7. 22: de la empresa 3, sobre una postulación del egresado 7
// (también lleva su egresadoId). 23: del egresado 8.
const notificacionesBase = () => [
  { id: 21, tipo: 'POSTULACION', contenido: 'Tu postulación cambió', fecha: new Date('2026-02-02'), vista: false,
    referenciaId: 5, mensajeId: null, postulacionId: 11, egresadoId: 7, empresaId: null },
  { id: 22, tipo: 'POSTULACION', contenido: 'Laura se postuló', fecha: new Date('2026-02-01'), vista: false,
    referenciaId: 5, mensajeId: null, postulacionId: 11, egresadoId: 7, empresaId: 3 },
  { id: 23, tipo: 'MENSAJE', contenido: 'Mensaje nuevo', fecha: new Date('2026-02-03'), vista: false,
    referenciaId: 6, mensajeId: 40, postulacionId: null, egresadoId: 8, empresaId: null },
];
let notificaciones;
const cumple = (fila, where) => Object.entries(where).every(([k, v]) => fila[k] === v);

const consultasNotificacion = () => Object.values(db.notificacion).reduce((t, fn) => t + fn.mock.calls.length, 0);

// --- Vacantes -------------------------------------------------------------------
const vacanteBase = (cambios) => ({
  titulo: 'Analista', descripcion: '<p>Funciones</p>', ubicacion: 'Fusagasugá', tipo: 'Indefinido',
  jornada: 'Completa', modalidad: 'Presencial', tipoSalario: 'Básico', salario: '2000000', horario: 'L-V',
  fechaCreacion: new Date('2026-01-15'), fechaCierre: null, limitePostulantes: null, estado: 'ABIERTA',
  empresaId: 3, updatedAt: new Date('2026-01-20'),
  empresa: { id: 3, nombre: 'Agro Andes', email: 'contacto@ejemplo.com', password: 'hash', nit: '900' },
  ...cambios,
});
const postulacion = (id, egresadoId) => ({
  id, egresadoId, estado: 'PENDIENTE', fecha: new Date('2026-02-01'), telefono: '3000000000',
  comentarioAdmin: 'nota interna', calificacionAdmin: 4, chatActivo: true, anclado: false, vacanteId: 0,
});
// 5: el egresado 7 y el 8 postulados. 6: sólo el 8. 9: cupos llenos (2 de 2).
const vacantesBase = () => [
  vacanteBase({ id: 5, postulaciones: [postulacion(11, 7), postulacion(12, 8)] }),
  vacanteBase({ id: 6, titulo: 'Contador', postulaciones: [postulacion(13, 8)] }),
  vacanteBase({ id: 9, titulo: 'Lleno', limitePostulantes: 2, postulaciones: [postulacion(14, 7), postulacion(15, 8)] }),
];
// Como Prisma: aplica el where anidado de postulaciones y calcula _count con todas.
const consultarVacantes = async (args) => vacantesBase().map((v) => {
  const filtro = args.select?.postulaciones?.where ?? args.include?.postulaciones?.where;
  const fila = {
    ...v,
    _count: { postulaciones: v.postulaciones.length },
    postulaciones: filtro ? v.postulaciones.filter((p) => cumple(p, filtro)) : v.postulaciones,
  };
  return proyectar(fila, args);
});

beforeEach(() => {
  vi.clearAllMocks();
  notificaciones = notificacionesBase();
  db.notificacion.findMany.mockImplementation(async (args) =>
    proyectar(notificaciones.filter((n) => cumple(n, args.where)), args));
  db.notificacion.updateMany.mockImplementation(async ({ where, data }) => {
    const afectadas = notificaciones.filter((n) => cumple(n, where));
    afectadas.forEach((n) => Object.assign(n, data));
    return { count: afectadas.length };
  });
  db.notificacion.deleteMany.mockImplementation(async ({ where }) => {
    const antes = notificaciones.length;
    notificaciones = notificaciones.filter((n) => !cumple(n, where));
    return { count: antes - notificaciones.length };
  });
  db.vacante.findMany.mockImplementation(consultarVacantes);
});

describe('GET /api/notificaciones/egresado/:egresadoId', () => {
  it.each([
    ['sin token', null],
    ['con token de empresa (mismo número)', EMPRESA_7],
    ['con token de administrador', TOKEN_ADMIN],
  ])('%s responde 403 y no consulta', async (_, token) => {
    const res = await pedir('get', '/api/notificaciones/egresado/7', token);
    expect(res.status).toBe(403);
    expect(consultasNotificacion()).toBe(0);
  });

  it('otro egresado, uno inexistente y un id no numérico reciben el mismo 404 sin consultar', async () => {
    const ajeno = await pedir('get', '/api/notificaciones/egresado/8', EGRESADO_7);
    const respuestas = [
      ajeno,
      await pedir('get', '/api/notificaciones/egresado/999', EGRESADO_7),
      await pedir('get', '/api/notificaciones/egresado/abc', EGRESADO_7),
      await pedir('get', '/api/notificaciones/egresado/7abc', EGRESADO_7),
    ];
    for (const res of respuestas) {
      expect(res.status).toBe(404);
      expect(res.body).toEqual(ajeno.body);
    }
    expect(consultasNotificacion()).toBe(0);
  });

  it('el propio egresado recibe sólo las suyas sin empresa, con los campos que lee el frontend', async () => {
    const res = await pedir('get', '/api/notificaciones/egresado/7', EGRESADO_7);
    expect(res.status).toBe(200);
    expect(db.notificacion.findMany.mock.calls[0][0].where).toEqual({ egresadoId: 7, empresaId: null });
    expect(res.body.map((n) => n.id)).toEqual([21]);
    expect(Object.keys(res.body[0]).sort()).toEqual([
      'contenido', 'fecha', 'id', 'mensajeId', 'postulacionId', 'referenciaId', 'tipo', 'vista',
    ]);
  });
});

describe('PUT /api/notificaciones/:id/leer', () => {
  it.each([
    ['sin token', null],
    ['con token de administrador', TOKEN_ADMIN],
  ])('%s responde 403 y no escribe', async (_, token) => {
    const res = await pedir('put', '/api/notificaciones/21/leer', token);
    expect(res.status).toBe(403);
    expect(consultasNotificacion()).toBe(0);
  });

  it('el egresado marca la suya', async () => {
    const res = await pedir('put', '/api/notificaciones/21/leer', EGRESADO_7);
    expect(res.status).toBe(200);
    expect(db.notificacion.updateMany.mock.calls[0][0].where).toEqual({ id: 21, egresadoId: 7, empresaId: null });
    expect(notificaciones.find((n) => n.id === 21).vista).toBe(true);
  });

  it('la empresa marca la suya (NotificacionesEmpresa)', async () => {
    const res = await pedir('put', '/api/notificaciones/22/leer', EMPRESA_3);
    expect(res.status).toBe(200);
    expect(db.notificacion.updateMany.mock.calls[0][0].where).toEqual({ id: 22, empresaId: 3 });
    expect(notificaciones.find((n) => n.id === 22).vista).toBe(true);
  });

  it('ajena, de la empresa sobre el propio egresado, inexistente o no numérica: el mismo 404 y nada cambia', async () => {
    const intentos = [
      ['/api/notificaciones/23/leer', EGRESADO_7], // de otro egresado
      ['/api/notificaciones/22/leer', EGRESADO_7], // de la empresa, aunque lleve su egresadoId
      ['/api/notificaciones/21/leer', EMPRESA_7], // empresa con el mismo número que el egresado
      ['/api/notificaciones/21/leer', EMPRESA_4],
      ['/api/notificaciones/22/leer', EMPRESA_4], // de otra empresa
      ['/api/notificaciones/22/leer', EGRESADO_3], // egresado con el mismo número que la empresa
      ['/api/notificaciones/999/leer', EGRESADO_7],
      ['/api/notificaciones/abc/leer', EGRESADO_7],
    ];
    const respuestas = [];
    for (const [ruta, token] of intentos) respuestas.push(await pedir('put', ruta, token));
    for (const res of respuestas) {
      expect(res.status).toBe(404);
      expect(res.body).toEqual(respuestas[0].body);
    }
    expect(notificaciones.every((n) => n.vista === false)).toBe(true);
    expect(db.notificacion.update).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/notificaciones/:id', () => {
  it.each([
    ['sin token', null],
    ['con token de empresa', EMPRESA_3],
    ['con token de administrador', TOKEN_ADMIN],
  ])('%s responde 403 y no borra', async (_, token) => {
    const res = await pedir('delete', '/api/notificaciones/22', token);
    expect(res.status).toBe(403);
    expect(consultasNotificacion()).toBe(0);
    expect(notificaciones).toHaveLength(3);
  });

  it('el egresado borra la suya', async () => {
    const res = await pedir('delete', '/api/notificaciones/21', EGRESADO_7);
    expect(res.status).toBe(200);
    expect(db.notificacion.deleteMany.mock.calls[0][0].where).toEqual({ id: 21, egresadoId: 7, empresaId: null });
    expect(notificaciones.map((n) => n.id)).toEqual([22, 23]);
  });

  it('ajena, de la empresa sobre él, inexistente o no numérica: el mismo 404 y no borra nada', async () => {
    const respuestas = [];
    for (const ruta of ['/api/notificaciones/23', '/api/notificaciones/22', '/api/notificaciones/999', '/api/notificaciones/abc']) {
      respuestas.push(await pedir('delete', ruta, EGRESADO_7));
    }
    for (const res of respuestas) {
      expect(res.status).toBe(404);
      expect(res.body).toEqual(respuestas[0].body);
    }
    expect(notificaciones).toHaveLength(3);
    expect(db.notificacion.delete).not.toHaveBeenCalled();
  });
});

describe('GET /api/vacantes/empresa/:id', () => {
  it.each([
    ['sin token', null],
    ['con token de egresado (mismo número)', EGRESADO_3],
    ['con token de administrador', TOKEN_ADMIN],
  ])('%s responde 403 y no consulta', async (_, token) => {
    const res = await pedir('get', '/api/vacantes/empresa/3', token);
    expect(res.status).toBe(403);
    expect(db.vacante.findMany).not.toHaveBeenCalled();
  });

  it('otra empresa, una inexistente y un id no numérico reciben el mismo 404 sin consultar (también la papelera)', async () => {
    const ajena = await pedir('get', '/api/vacantes/empresa/3', EMPRESA_4);
    const respuestas = [
      ajena,
      await pedir('get', '/api/vacantes/empresa/3?estado=ELIMINADA', EMPRESA_4),
      await pedir('get', '/api/vacantes/empresa/999', EMPRESA_4),
      await pedir('get', '/api/vacantes/empresa/abc', EMPRESA_4),
    ];
    for (const res of respuestas) {
      expect(res.status).toBe(404);
      expect(res.body).toEqual(ajena.body);
    }
    expect(db.vacante.findMany).not.toHaveBeenCalled();
  });

  it('la propia empresa lista sus vacantes (activas y papelera) sólo con su id', async () => {
    const activas = await pedir('get', '/api/vacantes/empresa/3', EMPRESA_3);
    const papelera = await pedir('get', '/api/vacantes/empresa/3?estado=ELIMINADA', EMPRESA_3);
    expect(activas.status).toBe(200);
    expect(papelera.status).toBe(200);
    expect(db.vacante.findMany.mock.calls[0][0].where).toEqual({ empresaId: 3, estado: { not: 'ELIMINADA' } });
    expect(db.vacante.findMany.mock.calls[1][0].where).toEqual({ empresaId: 3, estado: 'ELIMINADA' });
  });
});

describe('GET /api/vacantes (feed)', () => {
  it.each([
    ['sin token', null],
    ['con token de empresa', EMPRESA_3],
    ['con token de administrador', TOKEN_ADMIN],
  ])('%s responde 403 y no consulta', async (_, token) => {
    const res = await pedir('get', '/api/vacantes', token);
    expect(res.status).toBe(403);
    expect(db.vacante.findMany).not.toHaveBeenCalled();
  });

  it('el egresado recibe sólo su postulación, yaPostulado y el total en _count', async () => {
    const res = await pedir('get', '/api/vacantes', EGRESADO_7);
    expect(res.status).toBe(200);
    expect(db.vacante.findMany.mock.calls[0][0].select.postulaciones.where).toEqual({ egresadoId: 7 });

    const [v5, v6] = res.body;
    expect(v5.postulaciones).toEqual([{ id: 11, egresadoId: 7, estado: 'PENDIENTE', fecha: '2026-02-01T00:00:00.000Z' }]);
    expect(v5.yaPostulado).toBe(true);
    expect(v5._count).toEqual({ postulaciones: 2 });
    expect(v6.postulaciones).toEqual([]);
    expect(v6.yaPostulado).toBe(false);
    expect(v6._count).toEqual({ postulaciones: 1 });
  });

  it('nunca aparecen ids de otros egresados ni sus postulaciones', async () => {
    const res = await pedir('get', '/api/vacantes', EGRESADO_7);
    const egresadoIds = res.body.flatMap((v) => v.postulaciones.map((p) => p.egresadoId));
    expect(new Set(egresadoIds)).toEqual(new Set([7]));
    const postulacionIds = res.body.flatMap((v) => v.postulaciones.map((p) => p.id));
    expect(postulacionIds).not.toContain(12);
    expect(postulacionIds).not.toContain(13);
  });

  it('sigue ocultando las vacantes con los cupos llenos (cuenta todas las postulaciones, no sólo la propia)', async () => {
    const res = await pedir('get', '/api/vacantes', EGRESADO_7);
    expect(res.body.map((v) => v.id)).toEqual([5, 6]);
  });

  it('devuelve sólo los campos que leen VacantesDashboard, InicioEgresados y SolicitudesEgresado', async () => {
    const res = await pedir('get', '/api/vacantes', EGRESADO_8);
    expect(Object.keys(res.body[0]).sort()).toEqual([
      '_count', 'descripcion', 'empresa', 'empresaId', 'estado', 'fechaCierre', 'fechaCreacion', 'horario', 'id',
      'jornada', 'limitePostulantes', 'modalidad', 'postulaciones', 'salario', 'tipo', 'titulo', 'ubicacion', 'yaPostulado',
    ]);
    expect(res.body[0].empresa).toEqual({ id: 3, nombre: 'Agro Andes' });
    expect(Object.keys(res.body[0].postulaciones[0]).sort()).toEqual(['egresadoId', 'estado', 'fecha', 'id']);
  });
});
