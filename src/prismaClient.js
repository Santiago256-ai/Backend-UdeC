// Cambia la importación para que apunte a la nueva carpeta generada
import { PrismaClient } from './generated/client/index.js';

const globalForPrisma = globalThis;

// Mantenemos la lógica del Singleton para evitar demasiadas conexiones
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;