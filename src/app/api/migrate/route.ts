import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Migrar preguntas
        const questionsDir = path.join(process.cwd(), 'src', 'questions');
        const files = fs.readdirSync(questionsDir).filter(file => file.endsWith('.json'));

        for (const file of files) {
            const filePath = path.join(questionsDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const questions = JSON.parse(content);

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
        }

        // Migrar trofeos
        const trofeosPath = path.join(process.cwd(), 'src', 'data', 'trofeos.json');
        const trofeosContent = fs.readFileSync(trofeosPath, 'utf-8');
        const trofeos = JSON.parse(trofeosContent);

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

        return NextResponse.json({ message: 'Migración completada' });
    } catch (error) {
        console.error('Error en migración:', error);
        return NextResponse.json({ error: 'Error en migración' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}