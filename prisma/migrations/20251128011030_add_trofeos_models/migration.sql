-- CreateTable
CREATE TABLE "Trofeo" (
    "id" SERIAL NOT NULL,
    "imagen" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "criterio" TEXT NOT NULL,

    CONSTRAINT "Trofeo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_trofeos" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trofeoId" INTEGER NOT NULL,
    "desbloqueado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_trofeos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_trofeos_userId_trofeoId_key" ON "user_trofeos"("userId", "trofeoId");

-- AddForeignKey
ALTER TABLE "user_trofeos" ADD CONSTRAINT "user_trofeos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trofeos" ADD CONSTRAINT "user_trofeos_trofeoId_fkey" FOREIGN KEY ("trofeoId") REFERENCES "Trofeo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
