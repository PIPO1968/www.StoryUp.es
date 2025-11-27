import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const curso = searchParams.get('curso');
        const asignatura = searchParams.get('asignatura');

        if (!curso || !asignatura) {
            return NextResponse.json({ error: 'Faltan parámetros curso y asignatura' }, { status: 400 });
        }

        // Buscar preguntas por curso y asignatura
        const preguntas = await prisma.pregunta.findMany({
            where: {
                curso: curso,
                asignatura: asignatura
            }
        });

        return NextResponse.json(preguntas);
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}