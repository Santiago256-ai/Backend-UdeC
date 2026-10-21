// JWT_SECRET sin claves de respaldo (2026-10).
// El secreto de las pruebas es inventado (vitest.config.js). La clave de respaldo
// que tenía el código se lee del commit de producción con git show, sin
// escribirla en este archivo ni imprimirla.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const db = vi.hoisted(() => ({ empresa: { findUnique: vi.fn() } }));
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => db) }));

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const claveDeRespaldoAntigua = () => {
  const original = execSync('git show 77b3e80:src/middleware/authMiddleware.js', { cwd: RAIZ, encoding: 'utf8' });
  const encontrada = original.match(/process\.env\.JWT_SECRET\s*\|\|\s*(['"])(.+?)\1/);
  if (!encontrada) throw new Error('No se encontró la clave de respaldo en el código original.');
  return encontrada[2];
};

const SECRETO_DE_PRUEBA = process.env.JWT_SECRET;
const cargarSecreto = () => import('../src/config/jwtSecret.js');
const montarApp = async () => {
  const { default: empresaRoutes } = await import('../src/routes/empresaRoutes.js');
  const app = express();
  app.use(express.json());
  app.use('/api/empresas', empresaRoutes);
  return app;
};

let errores;
let avisos;
beforeEach(() => {
  vi.resetModules(); // cada prueba vuelve a leer el entorno desde cero
  vi.clearAllMocks();
  db.empresa.findUnique.mockResolvedValue({ id: 3, nombre: 'Agro Andes', vacantes: [] });
  errores = vi.spyOn(console, 'error').mockImplementation(() => {});
  avisos = vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  process.env.JWT_SECRET = SECRETO_DE_PRUEBA;
  vi.restoreAllMocks();
});

describe('src/config/jwtSecret.js', () => {
  it('sin JWT_SECRET falla al cargar con un mensaje claro en español', async () => {
    delete process.env.JWT_SECRET;
    await expect(cargarSecreto()).rejects.toThrow(
      /Falta la variable de entorno JWT_SECRET.*ninguna clave por defecto la reemplaza/,
    );
    expect(errores).toHaveBeenCalledTimes(1);
  });

  it.each([['vacía', ''], ['sólo espacios', '   ']])('con JWT_SECRET %s también falla', async (_, valor) => {
    process.env.JWT_SECRET = valor;
    await expect(cargarSecreto()).rejects.toThrow(/Falta la variable de entorno JWT_SECRET/);
  });

  it('el mensaje de error es siempre el mismo: no incluye ningún valor del entorno', async () => {
    delete process.env.JWT_SECRET;
    const sinDefinir = await cargarSecreto().catch((e) => e.message);
    vi.resetModules();
    process.env.JWT_SECRET = '   ';
    const conEspacios = await cargarSecreto().catch((e) => e.message);
    expect(sinDefinir).toMatch(/^Falta la variable de entorno JWT_SECRET/);
    expect(sinDefinir).toBe(conEspacios);
  });

  it('un secreto corto arranca igual, con una advertencia que no muestra el secreto ni su longitud', async () => {
    const corto = 'corto-inventado-1234';
    process.env.JWT_SECRET = corto;
    const { JWT_SECRET } = await cargarSecreto();
    expect(JWT_SECRET).toBe(corto);
    expect(avisos).toHaveBeenCalledTimes(1);
    const aviso = avisos.mock.calls[0].join(' ');
    expect(aviso).not.toContain(corto);
    expect(aviso).not.toContain(String(corto.length));
  });

  it('un secreto de 32 caracteres o más no avisa nada', async () => {
    await cargarSecreto();
    expect(avisos).not.toHaveBeenCalled();
    expect(errores).not.toHaveBeenCalled();
  });
});

describe('firma y verificación con JWT_SECRET definido', () => {
  it('un token firmado con JWT_SECRET pasa authMiddleware', async () => {
    const app = await montarApp();
    const token = jwt.sign({ id: 3, rol: 'empresa' }, SECRETO_DE_PRUEBA);
    const res = await request(app).get('/api/empresas/3').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('el token que emite el login se verifica con el mismo secreto', async () => {
    const { JWT_SECRET } = await cargarSecreto();
    const token = jwt.sign({ id: 3, rol: 'empresa' }, JWT_SECRET);
    expect(jwt.verify(token, SECRETO_DE_PRUEBA)).toMatchObject({ id: 3, rol: 'empresa' });
  });

  it('un token firmado con la clave de respaldo antigua es rechazado (401)', async () => {
    const app = await montarApp();
    const token = jwt.sign({ id: 3, rol: 'empresa' }, claveDeRespaldoAntigua());
    const res = await request(app).get('/api/empresas/3').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
    expect(db.empresa.findUnique).not.toHaveBeenCalled();
  });

  it('un token firmado con cualquier otro secreto también es rechazado (401)', async () => {
    const app = await montarApp();
    const token = jwt.sign({ id: 3, rol: 'empresa' }, 'otro-secreto-inventado-que-no-es-el-de-las-pruebas');
    const res = await request(app).get('/api/empresas/3').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});

describe('sin JWT_SECRET', () => {
  it('las rutas no llegan a cargar, así que nadie acepta un token firmado con la clave de respaldo', async () => {
    delete process.env.JWT_SECRET;
    let app;
    try {
      app = await montarApp();
    } catch (error) {
      expect(error.message).toMatch(/Falta la variable de entorno JWT_SECRET/);
      return;
    }
    // Si las rutas cargaron (el código antiguo), el token de respaldo no debe pasar.
    const token = jwt.sign({ id: 3, rol: 'empresa' }, claveDeRespaldoAntigua());
    const res = await request(app).get('/api/empresas/3').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});
