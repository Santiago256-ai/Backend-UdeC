-- Deriva entre el esquema de la última migración (commit 04810ee) y el de main
-- (2026-10-21). Estos cambios se aplicaron a la base con `prisma db push`, sin
-- migración: la base YA los tiene. NO se ejecuta: se registra como aplicada con
--   npx prisma migrate resolve --applied 20261021180000_sincronizar_deriva
-- Generado con `prisma migrate diff --from-schema-datamodel <esquema de 04810ee>
-- --to-schema-datamodel <esquema de main> --script` (sin conexión a la base).

-- AlterTable
ALTER TABLE "Educacion" ADD COLUMN     "actualmente" BOOLEAN DEFAULT false,
ADD COLUMN     "fechaFin" TEXT,
ADD COLUMN     "fechaInicio" TEXT;

-- AlterTable
ALTER TABLE "Experiencia" ADD COLUMN     "actualmente" BOOLEAN DEFAULT false,
ADD COLUMN     "fechaFin" TEXT,
ADD COLUMN     "fechaInicio" TEXT;

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "beneficios" TEXT,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "sitioWeb" TEXT,
ADD COLUMN     "visibilidad" JSONB;

-- AlterTable
ALTER TABLE "Notificacion" ADD COLUMN     "empresaId" INTEGER,
ALTER COLUMN "egresadoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

