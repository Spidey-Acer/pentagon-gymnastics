/*
  Warnings:

  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forename` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/

-- First, add columns with default values
ALTER TABLE "User" ADD COLUMN "address" TEXT DEFAULT 'Unknown Address';
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN "dateOfBirth" TIMESTAMP(3) DEFAULT '1990-01-01';
ALTER TABLE "User" ADD COLUMN "forename" TEXT DEFAULT 'Unknown';
ALTER TABLE "User" ADD COLUMN "phoneNumber" TEXT DEFAULT 'Unknown';
ALTER TABLE "User" ADD COLUMN "surname" TEXT DEFAULT 'User';
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing users with placeholder data
UPDATE "User" SET 
  "forename" = 'Admin',
  "surname" = 'User',
  "address" = 'System Administrator',
  "dateOfBirth" = '1990-01-01',
  "phoneNumber" = '+44 0000 000000'
WHERE "role" = 'admin';

UPDATE "User" SET 
  "forename" = 'Test',
  "surname" = 'User', 
  "address" = 'Test Address',
  "dateOfBirth" = '1995-01-01',
  "phoneNumber" = '+44 0000 000001'
WHERE "role" = 'user';

-- Now make the columns required (remove defaults)
ALTER TABLE "User" ALTER COLUMN "address" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "dateOfBirth" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "forename" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "phoneNumber" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "surname" DROP DEFAULT;

-- Make dateOfBirth NOT NULL
ALTER TABLE "User" ALTER COLUMN "dateOfBirth" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "address" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "forename" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "phoneNumber" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "surname" SET NOT NULL;
