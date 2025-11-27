import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

        // Get user stats from DB
        const stats = await prisma.userStats.findUnique({
            where: { userId: user.id }
        });

        return NextResponse.json({
            nick: user.nick,
            respuestasAcertadas: stats?.respuestasAcertadas || 0,
            preguntasFalladas: stats?.preguntasFalladas || 0,
            likes: user.likes || 0,
            // Add other stats as needed
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}