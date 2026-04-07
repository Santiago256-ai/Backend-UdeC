-- AlterTable
ALTER TABLE "Notificacion" ADD COLUMN     "postulacionId" INTEGER;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_postulacionId_fkey" FOREIGN KEY ("postulacionId") REFERENCES "Postulacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
