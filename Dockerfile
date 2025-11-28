# Dockerfile para Railway
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache libc6-compat

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar
CMD ["npm", "start"]