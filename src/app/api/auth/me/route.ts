import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Devolver usuario sin contraseña
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Error obteniendo usuario actual:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}