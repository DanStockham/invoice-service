-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('INITIALED', 'PENDING', 'PAID', 'LATE');

-- CreateTable
CREATE TABLE "BillingConfiguration" (
    "Id" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "addressId" INTEGER NOT NULL,
    "headingId" TEXT NOT NULL,

    CONSTRAINT "BillingConfiguration_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Company" (
    "Id" SERIAL NOT NULL,
    "Email" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Address" (
    "Id" SERIAL NOT NULL,
    "Street1" TEXT NOT NULL,
    "Street2" TEXT NOT NULL,
    "Street3" TEXT NOT NULL,
    "Street4" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "Zipcode" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Phone" (
    "Id" SERIAL NOT NULL,
    "PhoneNumber" TEXT NOT NULL,
    "Extension" TEXT NOT NULL,
    "CountryCode" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "companyId" INTEGER,
    "billingConfigurationId" TEXT,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "Id" SERIAL NOT NULL,
    "InvoiceNumber" TEXT NOT NULL,
    "Notes" TEXT NOT NULL,
    "Status" "InvoiceStatus" NOT NULL,
    "DateCreated" TIMESTAMP(3) NOT NULL,
    "CreatedBy" TEXT,
    "companyId" INTEGER NOT NULL,
    "termTypeId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "TermType" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Display" TEXT NOT NULL,
    "DaysWithinDue" INTEGER NOT NULL,

    CONSTRAINT "TermType_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "LineItem" (
    "Id" SERIAL NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "invoiceId" INTEGER,

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Offering" (
    "Id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Display" TEXT NOT NULL,
    "CostPerUnit" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" TEXT,
    "IsActive" BOOLEAN NOT NULL,

    CONSTRAINT "Offering_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "LineItemOfferings" (
    "LineItemId" INTEGER NOT NULL,
    "OfferingId" INTEGER NOT NULL,

    CONSTRAINT "LineItemOfferings_pkey" PRIMARY KEY ("LineItemId","OfferingId")
);

-- CreateTable
CREATE TABLE "Heading" (
    "Id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Logo" TEXT NOT NULL,
    "SubTitle" TEXT NOT NULL,

    CONSTRAINT "Heading_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingConfiguration_Email_key" ON "BillingConfiguration"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "BillingConfiguration_addressId_key" ON "BillingConfiguration"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "BillingConfiguration_headingId_key" ON "BillingConfiguration"("headingId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_Email_key" ON "Company"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_InvoiceNumber_key" ON "Invoice"("InvoiceNumber");

-- AddForeignKey
ALTER TABLE "BillingConfiguration" ADD CONSTRAINT "BillingConfiguration_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingConfiguration" ADD CONSTRAINT "BillingConfiguration_headingId_fkey" FOREIGN KEY ("headingId") REFERENCES "Heading"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_Id_fkey" FOREIGN KEY ("Id") REFERENCES "Company"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_billingConfigurationId_fkey" FOREIGN KEY ("billingConfigurationId") REFERENCES "BillingConfiguration"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_termTypeId_fkey" FOREIGN KEY ("termTypeId") REFERENCES "TermType"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItemOfferings" ADD CONSTRAINT "LineItemOfferings_LineItemId_fkey" FOREIGN KEY ("LineItemId") REFERENCES "LineItem"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItemOfferings" ADD CONSTRAINT "LineItemOfferings_OfferingId_fkey" FOREIGN KEY ("OfferingId") REFERENCES "Offering"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
