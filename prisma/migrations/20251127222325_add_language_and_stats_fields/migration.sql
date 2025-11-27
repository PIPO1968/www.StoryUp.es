-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nick" TEXT NOT NULL,
    "nombre" TEXT,
    "email" TEXT,
    "password" TEXT,
    "avatar" TEXT,
    "centro" TEXT,
    "curso" TEXT,
    "tipo" TEXT,
    "language" TEXT DEFAULT 'es',
    "fechaInscripcion" TIMESTAMP(3),
    "likes" INTEGER NOT NULL DEFAULT 0,
    "respuestasAcertadas" INTEGER NOT NULL DEFAULT 0,
    "competicionesSuperadas" INTEGER NOT NULL DEFAULT 0,
    "concursosGanados" INTEGER NOT NULL DEFAULT 0,
    "comentariosRecibidos" INTEGER NOT NULL DEFAULT 0,
    "historiasCreadas" INTEGER NOT NULL DEFAULT 0,
    "anosEnStoryUp" INTEGER NOT NULL DEFAULT 0,
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "stats_individual" JSONB,
    "stats_centro" JSONB,
    "stats_docente" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historias" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "autorId" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "autorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amigos" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amigoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "amigos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mensaje" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campeonatos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campeonatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concursos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "concursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_premium" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitudes_premium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones_usuario" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "palabras_prohibidas" (
    "id" SERIAL NOT NULL,
    "palabra" TEXT NOT NULL,

    CONSTRAINT "palabras_prohibidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premios_mensuales" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "premio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "premios_mensuales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "curso" TEXT NOT NULL,
    "asignatura" TEXT NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trofeo" (
    "id" SERIAL NOT NULL,
    "imagen" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "criterio" TEXT NOT NULL,

    CONSTRAINT "Trofeo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_nick_key" ON "users"("nick");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_clave_key" ON "configuracion"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "palabras_prohibidas_palabra_key" ON "palabras_prohibidas"("palabra");

-- AddForeignKey
ALTER TABLE "historias" ADD CONSTRAINT "historias_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amigos" ADD CONSTRAINT "amigos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amigos" ADD CONSTRAINT "amigos_amigoId_fkey" FOREIGN KEY ("amigoId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campeonatos" ADD CONSTRAINT "campeonatos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concursos" ADD CONSTRAINT "concursos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_premium" ADD CONSTRAINT "solicitudes_premium_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_usuario" ADD CONSTRAINT "sesiones_usuario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "premios_mensuales" ADD CONSTRAINT "premios_mensuales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
