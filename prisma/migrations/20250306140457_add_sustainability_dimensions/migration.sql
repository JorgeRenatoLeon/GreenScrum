-- CreateEnum
CREATE TYPE "SustainabilityDimension" AS ENUM ('INDIVIDUAL', 'ENVIRONMENTAL', 'SOCIAL', 'ECONOMIC', 'TECHNICAL');

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "sustainabilityDimensions" "SustainabilityDimension"[];
