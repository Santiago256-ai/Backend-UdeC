/*
  Warnings:

  - Added the required column `fechaActualizacion` to the `Postulacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Postulacion" ADD COLUMN     "calificacionAdmin" INTEGER DEFAULT 0,
ADD COLUMN     "comentarioAdmin" TEXT,
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3) NOT NULL;
