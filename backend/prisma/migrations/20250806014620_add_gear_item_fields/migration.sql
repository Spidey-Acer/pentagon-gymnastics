-- AlterTable
ALTER TABLE "GearItem" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'equipment',
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
