// Ronda "dueño", entrega 1 (2026-10): escritura de vacantes.
// POST /, PUT /:id, DELETE /:id, PUT /:id/reactivar y DELETE /:id/definitivo
// exigen sesión de empresa y sólo actúan sobre vacantes de esa empresa. Se
// comprueban el rol Y el id (los ids se repiten entre egresados, empresas y
// administradores). Ajena o inexistente: el mismo 404, sin escribir nada.
// Prisma, Supabase y el correo están simulados: no hay base de datos, red ni envíos.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { firmar, firmarAdmin } from './apoyo/simulador.js';

const db = vi.hoisted(() => ({
  vacante: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  postulacion: { deleteMany: vi.fn() },
  mensaje: { deleteMany: vi.fn() },
  administrador: { findUnique: vi.fn() },
}));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));
vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => ({})) }));
vi.mock('../src/services/emailService.js', () => ({ enviarCorreoCambioEstado: vi.fn() }));

const { default: vacantesRoutes } = await import('../src/routes/vacantesRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/vacantes', vacantesRoutes);

const DUENA = () => firmar({ id: 3, rol: 'empresa' });
const OTRA_EMPRESA = () => firmar({ id: 4, rol: 'empresa' });
const EGRESADO_MISMO_ID = () => firmar({ id: 3, rol: 'egresado' });
const ADMIN = () => firmarAdmin({}, { subject: '3' });

// Vacante 50 es de la empresa 3; la 99 no existe.
const VACANTE = { id: 50, empresaId: 3, estado: 'ABIERTA' };
const NUEVA = {
  titulo: 'Analista de datos', descripcion: '<p>Funciones</p>', ubicacion: 'Fusagasugá', tipo: 'Indefinido',
  jornada: 'Completa', modalidad: 'Presencial', tipoSalario: 'Fijo', horario: 'L-V 8-5', salario: '2500000',
};

const escrituras = () => db.vacante.create.mock.calls.length + db.vacante.update.mock.calls.length
  + db.vacante.delete.mock.calls.length + db.postulacion.deleteMany.mock.calls.length
  + db.mensaje.deleteMany.mock.calls.length;

const RUTAS = [
  ['POST /', (t) => con(request(app).post('/api/vacantes').send(NUEVA), t)],
  ['PUT /:id', (t, id = 50) => con(request(app).put(`/api/vacantes/${id}`).send({ titulo: 'Otro' }), t)],
  ['DELETE /:id', (t, id = 50) => con(request(app).delete(`/api/vacantes/${id}`), t)],
  ['PUT /:id/reactivar', (t, id = 50) => con(request(app).put(`/api/vacantes/${id}/reactivar`), t)],
  ['DELETE /:id/definitivo', (t, id = 50) => con(request(app).delete(`/api/vacantes/${id}/definitivo`), t)],
];
function con(peticion, token) { return token ? peticion.set('Authorization', token) : peticion; }

beforeEach(() => {
  vi.clearAllMocks();
  db.vacante.findUnique.mockImplementation(async ({ where }) => (where.id === 50 ? { ...VACANTE } : null));
  db.vacante.create.mockImplementation(async ({ data }) => ({ id: 51, ...data }));
  db.vacante.update.mockImplementation(async ({ where, data }) => ({ ...VACANTE, id: where.id, ...data }));
  db.administrador.findUnique.mockResolvedValue({ id: 3, usuario: 'admin.ops', nombre: null, activo: true });
});

describe('las 5 rutas de escritura rechazan a quien no es la empresa', () => {
  for (const [nombre, pedir] of RUTAS) {
    it(`${nombre}: sin token → 403, sin escribir`, async () => {
      expect((await pedir()).status).toBe(403);
      expect(escrituras()).toBe(0);
    });

    it(`${nombre}: egresado con el mismo id numérico que la empresa → 403, sin escribir`, async () => {
      expect((await pedir(EGRESADO_MISMO_ID())).status).toBe(403);
      expect(escrituras()).toBe(0);
    });

    it(`${nombre}: token de administrador → 403, sin escribir`, async () => {
      expect((await pedir(ADMIN())).status).toBe(403);
      expect(escrituras()).toBe(0);
    });
  }
});

describe('vacante ajena o inexistente: el mismo 404, sin escribir', () => {
  for (const [nombre, pedir] of RUTAS.slice(1)) {
    it(`${nombre}: otra empresa y vacante inexistente responden igual`, async () => {
      const ajena = await pedir(OTRA_EMPRESA(), 50);
      const inexistente = await pedir(DUENA(), 99);
      expect(ajena.status).toBe(404);
      expect(inexistente.status).toBe(404);
      expect(ajena.body).toEqual(inexistente.body);
      expect(escrituras()).toBe(0);
    });

    it(`${nombre}: un id que no es número → el mismo 404, sin consultar`, async () => {
      const res = await pedir(DUENA(), 'abc');
      expect(res.status).toBe(404);
      expect(db.vacante.findUnique).not.toHaveBeenCalled();
    });
  }
});

describe('la empresa dueña sí puede', () => {
  it('POST /: crea la vacante con el empresaId del token, aunque el cuerpo diga otro', async () => {
    const res = await RUTAS[0][1](DUENA()).send({ ...NUEVA, empresaId: 4 });
    expect(res.status).toBe(201);
    expect(db.vacante.create.mock.calls[0][0].data.empresaId).toBe(3);
  });

  it('POST /: sin empresaId en el cuerpo también funciona', async () => {
    const res = await request(app).post('/api/vacantes').set('Authorization', DUENA()).send(NUEVA);
    expect(res.status).toBe(201);
    expect(db.vacante.create.mock.calls[0][0].data.empresaId).toBe(3);
  });

  it('PUT /:id: edita su vacante', async () => {
    const res = await request(app).put('/api/vacantes/50').set('Authorization', DUENA()).send({ titulo: 'Otro' });
    expect(res.status).toBe(200);
    expect(db.vacante.update.mock.calls[0][0].where).toEqual({ id: 50 });
  });

  it('DELETE /:id: la manda a la papelera', async () => {
    const res = await request(app).delete('/api/vacantes/50').set('Authorization', DUENA());
    expect(res.status).toBe(200);
    expect(db.vacante.update.mock.calls[0][0]).toMatchObject({ where: { id: 50 }, data: { estado: 'ELIMINADA' } });
  });

  it('PUT /:id/reactivar: la vuelve a abrir', async () => {
    const res = await request(app).put('/api/vacantes/50/reactivar').set('Authorization', DUENA());
    expect(res.status).toBe(200);
    expect(db.vacante.update.mock.calls[0][0]).toMatchObject({ where: { id: 50 }, data: { estado: 'ABIERTA' } });
  });

  it('DELETE /:id/definitivo: borra postulaciones, mensajes y la vacante, sólo de la 50', async () => {
    const res = await request(app).delete('/api/vacantes/50/definitivo').set('Authorization', DUENA());
    expect(res.status).toBe(200);
    expect(db.postulacion.deleteMany.mock.calls[0][0]).toEqual({ where: { vacanteId: 50 } });
    expect(db.mensaje.deleteMany.mock.calls[0][0]).toEqual({ where: { vacanteId: 50 } });
    expect(db.vacante.delete.mock.calls[0][0]).toEqual({ where: { id: 50 } });
  });
});

describe('PUT /:id: estados permitidos', () => {
  const editar = (cuerpo) => request(app).put('/api/vacantes/50').set('Authorization', DUENA()).send(cuerpo);

  for (const estado of ['ABIERTA', 'CERRADA', 'DESACTIVADA']) {
    it(`"${estado}" se acepta`, async () => {
      expect((await editar({ estado })).status).toBe(200);
      expect(db.vacante.update.mock.calls[0][0].data.estado).toBe(estado);
    });
  }

  for (const estado of ['ELIMINADA', 'BORRADA', '', 'abierta', { $ne: 1 }]) {
    it(`${JSON.stringify(estado)} → 400, sin escribir`, async () => {
      expect((await editar({ estado })).status).toBe(400);
      expect(escrituras()).toBe(0);
    });
  }

  it('el formulario reenvía el estado actual aunque no esté en la lista: se acepta si no cambia', async () => {
    db.vacante.findUnique.mockResolvedValue({ ...VACANTE, estado: 'PAUSADA' });
    expect((await editar({ titulo: 'Otro', estado: 'PAUSADA' })).status).toBe(200);
  });

  it('sin estado en el cuerpo, no lo toca', async () => {
    await editar({ titulo: 'Otro' });
    expect(db.vacante.update.mock.calls[0][0].data.estado).toBeUndefined();
  });
});
