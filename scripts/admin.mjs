/**
 * Crea o restablece cuentas de administrador (tabla Administrador).
 *
 *   node scripts/admin.mjs crear --usuario X [--nombre "Y"]
 *   node scripts/admin.mjs restablecer --usuario X       → cambia la contraseña
 *
 * Ejecútalo desde backend/ en una terminal interactiva (PowerShell sirve). Usa
 * DATABASE_URL del entorno o del .env (la misma variable que lee Prisma). Antes de
 * tocar la base muestra SÓLO el host (para saber si apunta a la rama de ensayo o
 * a producción) y pide escribir "si".
 *
 * La contraseña se pide dos veces sin mostrarse en pantalla: mínimo 12
 * caracteres y máximo 72 bytes (bcrypt ignora lo que pase de ahí). Se guarda con
 * bcrypt de costo 12. Nunca se imprimen la contraseña ni el hash.
 *
 * El usuario se normaliza igual que en el login (sin espacios, en minúsculas).
 * "crear" se niega si el usuario ya existe; "restablecer" sólo cambia la
 * contraseña (no reactiva una cuenta inactiva).
 */
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import bcrypt from 'bcryptjs';
import { normalizarUsuario } from '../src/utils/usuarioAdmin.js';

export { normalizarUsuario };
export const COSTO_BCRYPT = 12;

export const validarPassword = (password, repetida) => {
  if (typeof password !== 'string' || [...password].length < 12) {
    return 'La contraseña debe tener al menos 12 caracteres.';
  }
  if (Buffer.byteLength(password, 'utf8') > 72) {
    return 'La contraseña no puede pasar de 72 bytes (bcrypt ignoraría el resto).';
  }
  if (password !== repetida) return 'Las dos contraseñas no coinciden.';
  return null;
};

export const validarUsuario = (usuario) =>
  /^[a-z0-9._-]{3,40}$/.test(normalizarUsuario(usuario) ?? '')
    ? null
    : 'El usuario debe tener de 3 a 40 caracteres: letras, números, punto, guion o guion bajo.';

// Sólo el host: nada de usuario, contraseña, base de datos ni parámetros.
export const hostDeLaBase = (url) => {
  try {
    return new URL(url).hostname || null;
  } catch {
    return null;
  }
};

const comprobar = (usuario, password) => {
  const error = validarUsuario(usuario) ?? validarPassword(password, password);
  if (error) throw new Error(error);
};

export const crearAdmin = async (prisma, { usuario, nombre, password }) => {
  const normalizado = normalizarUsuario(usuario);
  comprobar(normalizado, password);
  const existente = await prisma.administrador.findUnique({ where: { usuario: normalizado }, select: { id: true } });
  if (existente) throw new Error(`El usuario "${normalizado}" ya existe. Para cambiar su contraseña usa "restablecer".`);
  try {
    return await prisma.administrador.create({
      data: { usuario: normalizado, nombre: nombre?.trim() || null, password: await bcrypt.hash(password, COSTO_BCRYPT) },
      select: { id: true, usuario: true },
    });
  } catch (error) {
    if (error?.code === 'P2002') throw new Error(`El usuario "${normalizado}" ya existe.`);
    throw error;
  }
};

export const restablecerAdmin = async (prisma, { usuario, password }) => {
  const normalizado = normalizarUsuario(usuario);
  comprobar(normalizado, password);
  const existente = await prisma.administrador.findUnique({ where: { usuario: normalizado }, select: { id: true } });
  if (!existente) throw new Error(`El usuario "${normalizado}" no existe.`);
  return prisma.administrador.update({
    where: { id: existente.id },
    data: { password: await bcrypt.hash(password, COSTO_BCRYPT) },
    select: { id: true, usuario: true },
  });
};

// Lee una línea de la terminal en modo crudo. Con oculto no se muestra nada de lo
// que se escribe (ni asteriscos). Funciona en PowerShell, cmd y terminales Unix.
const leerLinea = (pregunta, { oculto = false } = {}) => new Promise((resolve, reject) => {
  const { stdin, stdout } = process;
  let texto = '';
  stdout.write(pregunta);
  stdin.setEncoding('utf8');
  stdin.setRawMode(true);
  stdin.resume();

  const terminar = (error) => {
    stdin.removeListener('data', alLeer);
    stdin.setRawMode(false);
    stdin.pause();
    stdout.write('\n');
    if (error) reject(error); else resolve(texto);
  };

  function alLeer(trozo) {
    if (trozo.startsWith('\u001b')) return; // flechas y otras teclas especiales
    for (const c of trozo) {
      if (c === '\r' || c === '\n') return terminar();
      if (c === '\u0003') return terminar(new Error('Cancelado.')); // Ctrl+C
      if (c === '\u007f' || c === '\b') {
        if (texto) {
          texto = [...texto].slice(0, -1).join('');
          if (!oculto) stdout.write('\b \b');
        }
        continue;
      }
      if (c < ' ') continue;
      texto += c;
      if (!oculto) stdout.write(c);
    }
  }
  stdin.on('data', alLeer);
});

const USO = `Uso:
  node scripts/admin.mjs crear --usuario X [--nombre "Y"]
  node scripts/admin.mjs restablecer --usuario X`;

const principal = async () => {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { usuario: { type: 'string' }, nombre: { type: 'string' } },
  });
  const [comando] = positionals;
  if (!['crear', 'restablecer'].includes(comando) || positionals.length > 1 || !values.usuario) {
    throw new Error(USO);
  }
  if (comando === 'restablecer' && values.nombre !== undefined) {
    throw new Error('"restablecer" sólo cambia la contraseña: no acepta --nombre.');
  }

  const usuario = normalizarUsuario(values.usuario);
  const errorUsuario = validarUsuario(usuario);
  if (errorUsuario) throw new Error(errorUsuario);

  if (!process.stdin.isTTY) {
    throw new Error('Ejecuta el script en una terminal interactiva: la contraseña se escribe a mano, sin mostrarse.');
  }

  await import('dotenv/config'); // no sobrescribe una DATABASE_URL ya definida en el entorno
  const host = hostDeLaBase(process.env.DATABASE_URL);
  if (!host) throw new Error('DATABASE_URL no está definida o no se puede leer.');

  console.log(`\nBase de datos (host): ${host}`);
  console.log(comando === 'crear'
    ? `Se va a CREAR el administrador "${usuario}".`
    : `Se va a CAMBIAR la contraseña del administrador "${usuario}".`);
  const respuesta = (await leerLinea('Escribe "si" para continuar: ')).trim().toLowerCase();
  if (respuesta !== 'si' && respuesta !== 'sí') {
    console.log('Cancelado: no se modificó nada.');
    return;
  }

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    // Se comprueba antes de pedir la contraseña, para no escribirla en vano.
    const existente = await prisma.administrador.findUnique({ where: { usuario }, select: { id: true } });
    if (comando === 'crear' && existente) throw new Error(`El usuario "${usuario}" ya existe. Para cambiar su contraseña usa "restablecer".`);
    if (comando === 'restablecer' && !existente) throw new Error(`El usuario "${usuario}" no existe.`);

    console.log('\nLa contraseña no se mostrará mientras la escribes.');
    const password = await leerLinea('Contraseña (mínimo 12 caracteres): ', { oculto: true });
    const repetida = await leerLinea('Repite la contraseña: ', { oculto: true });
    const errorPassword = validarPassword(password, repetida);
    if (errorPassword) throw new Error(errorPassword);

    if (comando === 'crear') {
      await crearAdmin(prisma, { usuario, nombre: values.nombre, password });
      console.log(`\nListo: administrador "${usuario}" creado.`);
    } else {
      await restablecerAdmin(prisma, { usuario, password });
      console.log(`\nListo: contraseña de "${usuario}" cambiada.`);
    }
  } finally {
    await prisma.$disconnect();
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  principal().catch((error) => {
    console.error(`\n${error.message}`);
    process.exitCode = 1;
  });
}
