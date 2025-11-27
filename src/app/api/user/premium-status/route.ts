import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nick = searchParams.get('nick');

        if (!nick) {
            return NextResponse.json({ error: 'Nick requerido' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { nick },
            select: { premium: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ isPremium: user.premium });
    } catch (error) {
        console.error('Error obteniendo estado premium:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}