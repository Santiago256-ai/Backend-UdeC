/*
  Warnings:

  - The `habilidades` column on the `PerfilCV` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PerfilCV" DROP COLUMN "habilidades",
ADD COLUMN     "habilidades" JSONB;
