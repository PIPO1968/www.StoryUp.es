-- CreateTable
CREATE TABLE "championship_results" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "centro" TEXT,
    "season" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "ganados" INTEGER NOT NULL DEFAULT 0,
    "perdidos" INTEGER NOT NULL DEFAULT 0,
    "preguntasAcertadas" INTEGER NOT NULL DEFAULT 0,
    "preguntasFalladas" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "championship_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "championship_results_userId_centro_season_type_key" ON "championship_results"("userId", "centro", "season", "type");

-- AddForeignKey
ALTER TABLE "championship_results" ADD CONSTRAINT "championship_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
