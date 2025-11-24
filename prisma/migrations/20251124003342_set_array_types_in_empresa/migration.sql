/*
  Warnings:

  - The `distributionChannels` column on the `Empresa` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `economicSector` column on the `Empresa` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "distributionChannels",
ADD COLUMN     "distributionChannels" TEXT[],
DROP COLUMN "economicSector",
ADD COLUMN     "economicSector" TEXT[];
