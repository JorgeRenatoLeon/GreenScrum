-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "acceptanceCriteria" TEXT,
ADD COLUMN     "storyPoints" INTEGER,
ADD COLUMN     "sustainabilityCriteria" TEXT,
ADD COLUMN     "sustainabilityPoints" INTEGER;
