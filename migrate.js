const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
    try {
        console.log('Iniciando migración...');

        // Crear tablas si no existen
        await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Pregunta" (
            id SERIAL PRIMARY KEY,
            pregunta TEXT,
            respuesta TEXT,
            categoria TEXT,
            curso TEXT,
            asignatura TEXT
        )`;

        await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Trofeo" (
            id SERIAL PRIMARY KEY,
            imagen TEXT,
            titulo TEXT,
            descripcion TEXT,
            criterio TEXT
        )`;

        console.log('Tablas creadas.');

        // Migrar preguntas
        const questionsDir = path.join(__dirname, 'src', 'questions');
        const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json'));

        console.log(`Encontrados ${files.length} archivos de preguntas.`);

        for (const file of files) {
            const filePath = path.join(questionsDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const questions = JSON.parse(content);

            const match = file.match(/^(.+)-(\d+primaria)\.json$/);
            if (!match) continue;

            const asignatura = match[1];
            const curso = match[2];

            console.log(`Migrando ${questions.length} preguntas de ${asignatura} para ${curso}`);

            for (const q of questions) {
                if (!q.pregunta || !q.respuesta || !q.categoria) continue;
                await prisma.pregunta.create({
                    data: {
                        pregunta: q.pregunta,
                        respuesta: q.respuesta,
                        categoria: q.categoria,
                        curso: curso,
                        asignatura: asignatura
                    }
                });
            }
        }

        // Migrar trofeos
        const trofeosPath = path.join(__dirname, 'src', 'data', 'trofeos.json');
        const trofeosContent = fs.readFileSync(trofeosPath, 'utf-8');
        const trofeos = JSON.parse(trofeosContent);

        console.log(`Migrando ${trofeos.length} trofeos`);

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

        console.log('Migración completada exitosamente');
    } catch (error) {
        console.error('Error en migración:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();