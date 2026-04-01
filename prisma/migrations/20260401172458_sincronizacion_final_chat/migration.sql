/*
  Warnings:

  - Made the column `vacanteId` on table `Mensaje` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Mensaje" DROP CONSTRAINT "Mensaje_vacanteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Mensaje" DROP CONSTRAINT "msg_receiver_empresa";

-- AlterTable
ALTER TABLE "Mensaje" ALTER COLUMN "vacanteId" SET NOT NULL;

-- RenameForeignKey
ALTER TABLE "Mensaje" RENAME CONSTRAINT "msg_receiver_egresado" TO "Mensaje_receiverId_fkey";

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_vacanteId_fkey" FOREIGN KEY ("vacanteId") REFERENCES "Vacante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
