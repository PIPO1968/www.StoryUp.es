# StoryUp - Red Social Educativa

Una plataforma educativa interactiva para estudiantes de primaria con funcionalidades de red social, aprendizaje y competiciones.

## 🚀 Despliegue en Producción

### Requisitos Previos

- Node.js 18+
- PostgreSQL (Railway recomendado)
- Cuenta en Railway o Vercel

### Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

Variables requeridas:
- `DATABASE_URL`: URL de PostgreSQL
- `JWT_SECRET`: Clave secreta para tokens JWT
- `NEXT_PUBLIC_APP_URL`: URL de producción (https://www.storyup.es)
- `NODE_ENV`: production

### Despliegue en Railway

1. **Conectar repositorio:**
   ```bash
   railway login
   railway link
   ```

2. **Configurar variables de entorno:**
   ```bash
   railway variables set DATABASE_URL="tu-database-url"
   railway variables set JWT_SECRET="tu-jwt-secret"
   railway variables set NEXT_PUBLIC_APP_URL="https://www.storyup.es"
   railway variables set NODE_ENV="production"
   ```

3. **Desplegar:**
   ```bash
   railway deploy
   ```

### Despliegue Local para Desarrollo

```bash
npm install
npm run postinstall  # Genera cliente Prisma
npm run dev
```

### Build de Producción

```bash
npm run build  # Incluye migraciones de DB y seed
npm start
```

## 📁 Estructura del Proyecto

- `src/app/`: Páginas y APIs de Next.js
- `src/components/`: Componentes React
- `prisma/`: Esquema de base de datos
- `public/`: Archivos estáticos

## 🛠️ Tecnologías

- **Frontend:** Next.js 16, React 19, TypeScript
- **Backend:** Next.js API Routes
- **Base de datos:** PostgreSQL con Prisma ORM
- **Autenticación:** JWT con cookies httpOnly
- **Estilos:** Tailwind CSS

## 📚 Funcionalidades

- 👤 Perfiles de usuario
- 📖 Creación de historias
- 📰 Sistema de noticias
- 🏆 Competiciones y torneos
- 💬 Chat entre usuarios
- 🎖️ Sistema de trofeos
- 👑 Modo Premium

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request
