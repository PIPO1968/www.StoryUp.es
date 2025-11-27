const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrateQuestions() {
    const questionsDir = path.join(__dirname, '..', 'questions');

    try {
        const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json'));

        for (const file of files) {
            const filePath = path.join(questionsDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const questions = JSON.parse(content);

            // Extraer curso y asignatura del nombre del archivo
            // Ej: matematicas-1primaria.json -> asignatura: matematicas, curso: 1primaria
            const match = file.match(/^(.+)-(\d+primaria)\.json$/);
            if (!match) continue;

            const asignatura = match[1];
            const curso = match[2];

            for (const q of questions) {
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

            console.log(`Migradas preguntas de ${file}`);
        }

        console.log('Migración completada');
    } catch (error) {
        console.error('Error en migración:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateQuestions();