#!/bin/bash

# Script de despliegue para StoryUp
echo "🚀 Iniciando despliegue de StoryUp..."

# Verificar que las variables de entorno estén configuradas
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL no está configurada"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ ERROR: JWT_SECRET no está configurada"
    exit 1
fi

echo "✅ Variables de entorno verificadas"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm ci

# Generar cliente Prisma
echo "🗄️ Generando cliente Prisma..."
npx prisma generate

# Ejecutar migraciones
echo "🗃️ Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

# Seed de base de datos
echo "🌱 Ejecutando seed de base de datos..."
node seed-database.js

# Build de la aplicación
echo "🔨 Construyendo aplicación..."
npm run build

echo "✅ Despliegue completado exitosamente!"
echo "🎉 Tu aplicación está lista para producción en https://www.storyup.es"