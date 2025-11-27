import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { nick, stat, amount } = await request.json();

        if (!nick || !stat || typeof amount !== 'number') {
            return NextResponse.json({ error: 'Faltan parámetros nick, stat o amount' }, { status: 400 });
        }

        // Validar que stat sea un campo válido
        const validStats = ['respuestasAcertadas', 'concursosGanados', 'historiasCreadas', 'likes', 'preguntasFalladas'];
        if (!validStats.includes(stat)) {
            return NextResponse.json({ error: 'Stat no válido' }, { status: 400 });
        }

        // Actualizar el usuario
        const updatedUser = await prisma.user.update({
            where: { nick },
            data: {
                [stat]: {
                    increment: amount
                }
            }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}