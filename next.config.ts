import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para producción
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://www.storyup.es'
  },
  // Configuración de imágenes si usas un dominio externo
  images: {
    domains: ['www.storyup.es', 'storyup.es'],
  },
  // Configuración de headers para seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
