import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const session = await prisma.sesionUsuario.findFirst({
            where: { token: sessionToken }
        });

        if (!session) {
            return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const { nick, stat, amount } = await request.json();

        if (!nick || !stat || typeof amount !== 'number') {
            return NextResponse.json({ error: 'Faltan parámetros nick, stat o amount' }, { status: 400 });
        }

        // Verify the nick matches the authenticated user
        if (nick !== user.nick) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
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