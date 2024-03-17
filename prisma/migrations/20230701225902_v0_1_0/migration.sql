/*
  Warnings:

  - You are about to drop the `LineItemOfferings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `offeringId` to the `LineItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LineItemOfferings" DROP CONSTRAINT "LineItemOfferings_LineItemId_fkey";

-- DropForeignKey
ALTER TABLE "LineItemOfferings" DROP CONSTRAINT "LineItemOfferings_OfferingId_fkey";

-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "offeringId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "LineItemOfferings";

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "Offering"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
