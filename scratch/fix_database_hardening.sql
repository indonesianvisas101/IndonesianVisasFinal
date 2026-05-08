-- SQL Script to fix "Failed to save verification"
-- Run this in your Supabase SQL Editor

-- Add new columns to the Verification table
-- Note: We use "public"."Verification" (case-sensitive) as per Prisma default
-- If your table is named "verifications", change the name accordingly.

ALTER TABLE "Verification" 
ADD COLUMN IF NOT EXISTS "isAgreementRequired" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "agreementStatus" TEXT DEFAULT 'NONE',
ADD COLUMN IF NOT EXISTS "depositAmount" DECIMAL(20,2),
ADD COLUMN IF NOT EXISTS "accessPin" TEXT DEFAULT '123456',
ADD COLUMN IF NOT EXISTS "signatureData" TEXT,
ADD COLUMN IF NOT EXISTS "agreementSignedAt" TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS "ipAddress" TEXT,
ADD COLUMN IF NOT EXISTS "invoiceId" TEXT;

-- Create an index for the slug to ensure fast lookups
CREATE INDEX IF NOT EXISTS "idx_verification_slug" ON "Verification" ("slug");

-- If your database uses "verifications" (all lowercase, plural) as mapping:
/*
ALTER TABLE "verifications" 
ADD COLUMN IF NOT EXISTS "isAgreementRequired" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "agreementStatus" TEXT DEFAULT 'NONE',
ADD COLUMN IF NOT EXISTS "depositAmount" DECIMAL(20,2),
ADD COLUMN IF NOT EXISTS "accessPin" TEXT DEFAULT '123456',
ADD COLUMN IF NOT EXISTS "signatureData" TEXT,
ADD COLUMN IF NOT EXISTS "agreementSignedAt" TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS "ipAddress" TEXT,
ADD COLUMN IF NOT EXISTS "invoiceId" TEXT;
*/
