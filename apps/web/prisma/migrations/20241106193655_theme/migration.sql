-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#8b5cf6',
    "accentColor" TEXT NOT NULL DEFAULT '#14b8a6',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "textColor" TEXT NOT NULL DEFAULT '#171717',
    "fontFamily" TEXT NOT NULL DEFAULT 'geist',
    "customCss" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cardStyle" TEXT NOT NULL DEFAULT 'default',
    "animation" TEXT NOT NULL DEFAULT 'fade',
    "borderRadius" TEXT NOT NULL DEFAULT 'rounded',
    "shadows" BOOLEAN NOT NULL DEFAULT true,
    "glassmorphism" BOOLEAN NOT NULL DEFAULT false,
    "pattern" TEXT,
    "backgroundImage" TEXT,
    "backgroundBlur" INTEGER NOT NULL DEFAULT 0,
    "backgroundOverlay" TEXT,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_userId_key" ON "Theme"("userId");

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
