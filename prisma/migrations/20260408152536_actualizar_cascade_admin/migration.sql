-- DropForeignKey
ALTER TABLE "public"."Mensaje" DROP CONSTRAINT "Mensaje_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Mensaje" DROP CONSTRAINT "Mensaje_senderEgresadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notificacion" DROP CONSTRAINT "Notificacion_egresadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PerfilCV" DROP CONSTRAINT "PerfilCV_egresadoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Postulacion" DROP CONSTRAINT "Postulacion_egresadoId_fkey";

-- AddForeignKey
ALTER TABLE "PerfilCV" ADD CONSTRAINT "PerfilCV_egresadoId_fkey" FOREIGN KEY ("egresadoId") REFERENCES "Egresado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_egresadoId_fkey" FOREIGN KEY ("egresadoId") REFERENCES "Egresado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_senderEgresadoId_fkey" FOREIGN KEY ("senderEgresadoId") REFERENCES "Egresado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Egresado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_egresadoId_fkey" FOREIGN KEY ("egresadoId") REFERENCES "Egresado"("id") ON DELETE CASCADE ON UPDATE CASCADE;
