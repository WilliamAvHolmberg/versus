-- CreateTable
CREATE TABLE "UsernameRedirect" (
    "id" TEXT NOT NULL,
    "oldUsername" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsernameRedirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsernameRedirect_userId_idx" ON "UsernameRedirect"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UsernameRedirect_oldUsername_key" ON "UsernameRedirect"("oldUsername");

-- AddForeignKey
ALTER TABLE "UsernameRedirect" ADD CONSTRAINT "UsernameRedirect_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
