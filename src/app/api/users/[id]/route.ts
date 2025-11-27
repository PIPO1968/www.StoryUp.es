import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // No devolver la contraseña
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}