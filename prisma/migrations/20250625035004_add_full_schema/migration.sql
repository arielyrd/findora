-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LostReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lostDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Hilang',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LostReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoundItem" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "color" TEXT,
    "category" TEXT NOT NULL,
    "locationFound" TEXT NOT NULL,
    "foundDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Ditemukan',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoundItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "foundItemId" INTEGER,
    "message" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matching" (
    "id" SERIAL NOT NULL,
    "lostReportId" INTEGER NOT NULL,
    "foundItemId" INTEGER NOT NULL,
    "matchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matching_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "LostReport" ADD CONSTRAINT "LostReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoundItem" ADD CONSTRAINT "FoundItem_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_foundItemId_fkey" FOREIGN KEY ("foundItemId") REFERENCES "FoundItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matching" ADD CONSTRAINT "Matching_lostReportId_fkey" FOREIGN KEY ("lostReportId") REFERENCES "LostReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matching" ADD CONSTRAINT "Matching_foundItemId_fkey" FOREIGN KEY ("foundItemId") REFERENCES "FoundItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
