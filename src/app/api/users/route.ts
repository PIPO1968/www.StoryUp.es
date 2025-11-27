import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            include: {
                historias: true,
                amigosComoUser: true,
                amigosComoAmigo: true,
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}