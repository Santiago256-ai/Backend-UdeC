// Fase 1 (2026-10): scripts/admin.mjs, que crea y restablece cuentas de
// administrador desde la terminal. Aquí se prueban sus piezas sin terminal ni base:
// la validación de la contraseña, la normalización del usuario, el host que se
// muestra antes de escribir y las escrituras contra un Prisma simulado.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn(() => ({})) }));

const {
  validarPassword, normalizarUsuario, validarUsuario, hostDeLaBase, crearAdmin, restablecerAdmin, COSTO_BCRYPT,
} = await import('../scripts/admin.mjs');

const CLAVE = 'una-clave-de-doce';

const prismaSimulado = (existente = null) => ({
  administrador: {
    findUnique: vi.fn(async ({ where }) => (existente && where.usuario === existente.usuario ? { id: existente.id } : null)),
    create: vi.fn(async ({ data }) => ({ id: 2, usuario: data.usuario })),
    update: vi.fn(async ({ where }) => ({ id: where.id })),
  },
});

let salida;
beforeEach(() => {
  vi.restoreAllMocks();
  salida = [];
  for (const metodo of ['log', 'error', 'warn', 'info']) {
    vi.spyOn(console, metodo).mockImplementation((...args) => salida.push(args.join(' ')));
  }
});

describe('validarPassword', () => {
  it('exige al menos 12 caracteres', () => {
    expect(validarPassword('corta-11ch.', 'corta-11ch.')).toMatch(/12 caracteres/);
    expect(validarPassword('', '')).toMatch(/12 caracteres/);
    expect(validarPassword(CLAVE, CLAVE)).toBeNull();
  });

  it('cuenta caracteres, no bytes, para el mínimo', () => {
    expect(validarPassword('ñandú-ñandú', 'ñandú-ñandú')).toMatch(/12 caracteres/); // 11 caracteres
  });

  it('las dos entradas deben coincidir', () => {
    expect(validarPassword(CLAVE, `${CLAVE}x`)).toMatch(/no coinciden/);
  });

  it('rechaza más de 72 bytes (bcrypt ignoraría el resto)', () => {
    const larga = 'a'.repeat(73);
    expect(validarPassword(larga, larga)).toMatch(/72/);
  });
});

describe('usuario y host', () => {
  it('normaliza igual que el login (trim + minúsculas)', () => {
    expect(normalizarUsuario('  Admin.OPS ')).toBe('admin.ops');
  });

  it('acepta letras, números, punto, guion y guion bajo (3 a 40)', () => {
    expect(validarUsuario('admin.ops')).toBeNull();
    expect(validarUsuario('ab')).not.toBeNull();
    expect(validarUsuario('con espacio')).not.toBeNull();
    expect(validarUsuario('correo@udec.edu.co')).not.toBeNull();
  });

  it('del DATABASE_URL muestra sólo el host: sin usuario, contraseña, base ni parámetros', () => {
    const host = hostDeLaBase('postgresql://dueno:clave-secreta@ep-ejemplo-123.us-east-2.aws.neon.tech/neondb?sslmode=require');
    expect(host).toBe('ep-ejemplo-123.us-east-2.aws.neon.tech');
  });

  it('sin DATABASE_URL o con un valor ilegible devuelve null', () => {
    expect(hostDeLaBase(undefined)).toBeNull();
    expect(hostDeLaBase('no es una url')).toBeNull();
  });
});

describe('crearAdmin', () => {
  it('se niega si el usuario ya existe y no escribe nada', async () => {
    const prisma = prismaSimulado({ id: 1, usuario: 'admin.ops' });
    await expect(crearAdmin(prisma, { usuario: ' Admin.Ops ', nombre: null, password: CLAVE })).rejects.toThrow(/ya existe/);
    expect(prisma.administrador.create).not.toHaveBeenCalled();
  });

  it('crea con el usuario normalizado y un hash bcrypt de costo 12', async () => {
    const prisma = prismaSimulado();
    await crearAdmin(prisma, { usuario: 'Admin.Ops', nombre: 'Oficina de Egresados', password: CLAVE });
    const { data, select } = prisma.administrador.create.mock.calls[0][0];
    expect(data.usuario).toBe('admin.ops');
    expect(data.nombre).toBe('Oficina de Egresados');
    expect(COSTO_BCRYPT).toBe(12);
    expect(data.password).toMatch(/^\$2[aby]\$12\$/);
    expect(await bcrypt.compare(CLAVE, data.password)).toBe(true);
    expect(select?.password).toBeFalsy();
  });

  it('no imprime la contraseña ni el hash', async () => {
    const prisma = prismaSimulado();
    await crearAdmin(prisma, { usuario: 'admin.ops', nombre: null, password: CLAVE });
    const hash = prisma.administrador.create.mock.calls[0][0].data.password;
    const texto = salida.join('\n');
    expect(texto).not.toContain(CLAVE);
    expect(texto).not.toContain(hash);
  });

  it('valida la contraseña también aquí, no sólo en la terminal', async () => {
    const prisma = prismaSimulado();
    await expect(crearAdmin(prisma, { usuario: 'admin.ops', nombre: null, password: 'corta' })).rejects.toThrow(/12 caracteres/);
    expect(prisma.administrador.create).not.toHaveBeenCalled();
  });
});

describe('restablecerAdmin', () => {
  it('falla si el usuario no existe', async () => {
    const prisma = prismaSimulado();
    await expect(restablecerAdmin(prisma, { usuario: 'nadie', password: CLAVE })).rejects.toThrow(/no existe/);
    expect(prisma.administrador.update).not.toHaveBeenCalled();
  });

  it('cambia sólo la contraseña, con costo 12', async () => {
    const prisma = prismaSimulado({ id: 1, usuario: 'admin.ops' });
    await restablecerAdmin(prisma, { usuario: 'ADMIN.OPS', password: CLAVE });
    const { where, data } = prisma.administrador.update.mock.calls[0][0];
    expect(where).toEqual({ id: 1 });
    expect(Object.keys(data)).toEqual(['password']);
    expect(data.password).toMatch(/^\$2[aby]\$12\$/);
    expect(await bcrypt.compare(CLAVE, data.password)).toBe(true);
    expect(salida.join('\n')).not.toContain(CLAVE);
  });
});
