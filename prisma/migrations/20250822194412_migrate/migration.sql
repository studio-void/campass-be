-- CreateEnum
CREATE TYPE "public"."CheckRequestType" AS ENUM ('SINGLE_EXIT', 'DOUBLE_EXIT', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "public"."CheckRequestStatus" AS ENUM ('PASS', 'FIRST_CHECK', 'SECOND_CHECK', 'THIRD_CHECK', 'FAIL');

-- CreateEnum
CREATE TYPE "public"."VerifyStatus" AS ENUM ('NONE', 'PENDING', 'VERIFIED');

-- CreateTable
CREATE TABLE "public"."CheckRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dorm" TEXT NOT NULL,
    "notes" TEXT,
    "type" "public"."CheckRequestType" NOT NULL,
    "status" "public"."CheckRequestStatus" NOT NULL DEFAULT 'FIRST_CHECK',
    "checkAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StorageRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storage" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "isStored" BOOLEAN NOT NULL DEFAULT false,
    "storeAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Facility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "location" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "openTime" TIMESTAMP(3) NOT NULL,
    "closeTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FacilityRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "facilityId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacilityRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Equipment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EquipmentHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "number" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "verifyStatus" "public"."VerifyStatus" NOT NULL DEFAULT 'NONE',
    "verifyImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wiki" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "school" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wiki_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WikiHistory" (
    "id" SERIAL NOT NULL,
    "wikiId" INTEGER NOT NULL,
    "editorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,

    CONSTRAINT "WikiHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheckRequest_userId_checkAt_idx" ON "public"."CheckRequest"("userId", "checkAt");

-- CreateIndex
CREATE INDEX "CheckRequest_dorm_checkAt_idx" ON "public"."CheckRequest"("dorm", "checkAt");

-- CreateIndex
CREATE INDEX "StorageRequest_userId_storeAt_idx" ON "public"."StorageRequest"("userId", "storeAt");

-- CreateIndex
CREATE INDEX "StorageRequest_storage_storeAt_idx" ON "public"."StorageRequest"("storage", "storeAt");

-- CreateIndex
CREATE INDEX "FacilityRequest_facilityId_startTime_endTime_idx" ON "public"."FacilityRequest"("facilityId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "EquipmentHistory_userId_createdAt_idx" ON "public"."EquipmentHistory"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_number_key" ON "public"."User"("number");

-- AddForeignKey
ALTER TABLE "public"."CheckRequest" ADD CONSTRAINT "CheckRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StorageRequest" ADD CONSTRAINT "StorageRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacilityRequest" ADD CONSTRAINT "FacilityRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FacilityRequest" ADD CONSTRAINT "FacilityRequest_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "public"."Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EquipmentHistory" ADD CONSTRAINT "EquipmentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EquipmentHistory" ADD CONSTRAINT "EquipmentHistory_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "public"."Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wiki" ADD CONSTRAINT "Wiki_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WikiHistory" ADD CONSTRAINT "WikiHistory_wikiId_fkey" FOREIGN KEY ("wikiId") REFERENCES "public"."Wiki"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WikiHistory" ADD CONSTRAINT "WikiHistory_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
