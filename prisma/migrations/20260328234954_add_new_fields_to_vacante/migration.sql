/*
  Warnings:

  - You are about to drop the column `senderUsuarioId` on the `Mensaje` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Notificacion` table. All the data in the column will be lost.
  - You are about to drop the column `cv_url` on the `Postulacion` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `Postulacion` table. All the data in the column will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[resetToken]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vacanteId,egresadoId]` on the table `Postulacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `egresadoId` to the `Notificacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `egresadoId` to the `Postulacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horario` to the `Vacante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jornada` to the `Vacante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoSalario` to the `Vacante` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Mensaje" DROP CONSTRAINT "Mensaje_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Mensaje" DROP CONSTRAINT "Mensaje_senderUsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notificacion" DROP CONSTRAINT "Notificacion_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Postulacion" DROP CONSTRAINT "Postulacion_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "modalidad" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Mensaje" DROP COLUMN "senderUsuarioId",
ADD COLUMN     "senderEgresadoId" INTEGER,
ADD COLUMN     "vacanteId" INTEGER;

-- AlterTable
ALTER TABLE "Notificacion" DROP COLUMN "usuarioId",
ADD COLUMN     "egresadoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Postulacion" DROP COLUMN "cv_url",
DROP COLUMN "usuarioId",
ADD COLUMN     "chatActivo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "egresadoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Vacante" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'ABIERTA',
ADD COLUMN     "fechaCierre" TIMESTAMP(3),
ADD COLUMN     "horario" TEXT NOT NULL,
ADD COLUMN     "jornada" TEXT NOT NULL,
ADD COLUMN     "limitePostulantes" INTEGER,
ADD COLUMN     "tipoSalario" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Usuario";

-- CreateTable
CREATE TABLE "Egresado" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "firebaseUid" TEXT,

    CONSTRAINT "Egresado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilCV" (
    "id" SERIAL NOT NULL,
    "egresadoId" INTEGER NOT NULL,
    "celular" TEXT,
    "facultad" TEXT,
    "programa" TEXT,
    "direccion" TEXT,
    "descripcion" TEXT,
    "habilidades" TEXT,

    CONSTRAINT "PerfilCV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Educacion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "institucion" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "perfilId" INTEGER NOT NULL,

    CONSTRAINT "Educacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiencia" (
    "id" SERIAL NOT NULL,
    "cargo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "perfilId" INTEGER NOT NULL,

    CONSTRAINT "Experiencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aptitud" (
    "id" SERIAL NOT NULL,
    "aptitud" TEXT NOT NULL,
    "perfilCVId" INTEGER NOT NULL,

    CONSTRAINT "Aptitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idioma" (
    "id" SERIAL NOT NULL,
    "idioma" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,
    "perfilCVId" INTEGER NOT NULL,

    CONSTRAINT "Idioma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referencia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "perfilId" INTEGER NOT NULL,

    CONSTRAINT "Referencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Egresado_correo_key" ON "Egresado"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Egresado_resetToken_key" ON "Egresado"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Egresado_firebaseUid_key" ON "Egresado"("firebaseUid");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilCV_egresadoId_key" ON "PerfilCV"("egresadoId");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_resetToken_key" ON "Empresa"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Postulacion_vacanteId_egresadoId_key" ON "Postulacion"("vacanteId", "egresadoId");

-- AddForeignKey
ALTER TABLE "PerfilCV" ADD CONSTRAINT "PerfilCV_egresadoId_fkey" FOREIGN KEY ("egresadoId") REFERENCES "Egresado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Educacion" ADD CONSTRAINT "Educacion_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "PerfilCV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiencia" ADD CONSTRAINT "Experiencia_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "PerfilCV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aptitud" ADD CONSTRAINT "Aptitud_perfilCVId_fkey" FOREIGN KEY ("perfilCVId") REFERENCES "PerfilCV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idioma" ADD CONSTRAINT "Idioma_perfilCVId_fkey" FOREIGN KEY ("perfilCVId") REFERENCES "PerfilCV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referencia" ADD CONSTRAINT "Referencia_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "PerfilCV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postulacion" ADD CONSTRAINT "Postulacion_egresadoId_fkey" FOREIGN KEY ("egresadoId") REFERENCES "Egresado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Egresado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_senderEgresadoId_fkey" FOREIGN KEY ("senderEgresadoId") REFERENCES "Egresado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_vacanteId_fkey" FOREIGN KEY ("vacanteId") REFERENCES "Vacante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_egresadoId_fkey" FOREIGN KEY ("egresadoId") REFERENCES "Egresado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
