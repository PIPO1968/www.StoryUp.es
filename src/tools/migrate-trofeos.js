const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateTrofeos() {
    const trofeosPath = path.join(__dirname, '..', 'data', 'trofeos.json');

    try {
        const content = fs.readFileSync(trofeosPath, 'utf-8');
        const trofeos = JSON.parse(content);

        for (const t of trofeos) {
            await prisma.trofeo.create({
                data: {
                    imagen: t.imagen,
                    titulo: t.titulo,
                    descripcion: t.descripcion,
                    criterio: t.criterio
                }
            });
        }

        console.log('Trofeos migrados');
    } catch (error) {
        console.error('Error en migración de trofeos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateTrofeos();