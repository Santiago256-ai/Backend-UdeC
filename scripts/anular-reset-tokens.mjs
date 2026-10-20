/**
 * Anula todos los enlaces de restablecimiento de contraseña pendientes:
 * pone resetToken y resetTokenExpiry en null en Egresado y Empresa.
 *
 * Motivo: hasta la contención de 2026-10, GET /api/usuarios/admin/todos y
 * GET /api/empresas/admin/todas devolvían esos campos sin pedir autenticación,
 * así que cualquier token vigente debe considerarse expuesto. Anularlos sólo
 * obliga a quien esté a mitad de un restablecimiento a pedir otro enlace.
 *
 * NO lo ejecutes sin decidir antes contra qué base corre. Usa DATABASE_URL del
 * entorno (la misma variable que lee Prisma); conviene probarlo primero en una
 * rama de Neon.
 *
 *   node scripts/anular-reset-tokens.mjs              → sólo cuenta (no escribe)
 *   node scripts/anular-reset-tokens.mjs --confirmar  → anula, en una transacción
 *
 * Nunca imprime tokens ni correos: sólo cantidades.
 */
import { PrismaClient } from '@prisma/client';

const confirmar = process.argv.includes('--confirmar');
const prisma = new PrismaClient();
const conToken = { resetToken: { not: null } };

try {
  const [egresados, empresas] = await Promise.all([
    prisma.egresado.count({ where: conToken }),
    prisma.empresa.count({ where: conToken }),
  ]);
  console.log(`Egresados con resetToken: ${egresados}`);
  console.log(`Empresas con resetToken:  ${empresas}`);

  if (!confirmar) {
    console.log('\nModo de sólo lectura: no se modificó nada. Repite con --confirmar para anularlos.');
  } else {
    const limpiar = { resetToken: null, resetTokenExpiry: null };
    const [e, c] = await prisma.$transaction([
      prisma.egresado.updateMany({ where: conToken, data: limpiar }),
      prisma.empresa.updateMany({ where: conToken, data: limpiar }),
    ]);
    console.log(`\nAnulados: ${e.count} egresado(s) y ${c.count} empresa(s).`);
  }
} catch (error) {
  console.error('No se pudo completar:', error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
