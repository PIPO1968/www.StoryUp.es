import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { curso, asignatura, pregunta, respuesta } = await request.json();

        if (!curso || !asignatura || !pregunta || !respuesta) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
        }

        // Insertar la nueva pregunta en la base de datos
        const nuevaPregunta = await prisma.pregunta.create({
            data: {
                pregunta: pregunta.trim(),
                respuesta: respuesta.trim(),
                categoria: asignatura.charAt(0).toUpperCase() + asignatura.slice(1), // Capitalizar
                curso: curso,
                asignatura: asignatura
            }
        });

        return NextResponse.json({ message: `Pregunta agregada con ID ${nuevaPregunta.id}` });
    } catch (error) {
        console.error('Error al agregar pregunta:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}