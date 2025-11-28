/*
  Warnings:

  - You are about to drop the `Trofeo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Trofeo";

-- CreateTable
CREATE TABLE "premium_data" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3),
    "fechaExpiracion" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "premium_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "torneos_premium" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "torneos" JSONB NOT NULL,
    "lastReset" TIMESTAMP(3),
    "torneoActivo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "torneos_premium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competiciones_premium" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "victorias" INTEGER NOT NULL DEFAULT 0,
    "participaciones" INTEGER NOT NULL DEFAULT 0,
    "puntuacionTotal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competiciones_premium_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "premium_data_userId_key" ON "premium_data"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "torneos_premium_userId_key" ON "torneos_premium"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "competiciones_premium_userId_key" ON "competiciones_premium"("userId");

-- AddForeignKey
ALTER TABLE "premium_data" ADD CONSTRAINT "premium_data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "torneos_premium" ADD CONSTRAINT "torneos_premium_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competiciones_premium" ADD CONSTRAINT "competiciones_premium_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
