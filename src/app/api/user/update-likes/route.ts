import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const { nick, likes } = await request.json();

        // Actualizar likes del usuario
        const updatedUser = await prisma.user.update({
            where: { nick },
            data: { likes }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error actualizando likes:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}