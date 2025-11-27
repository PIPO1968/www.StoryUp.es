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

        const { language } = await request.json();

        // Actualizar idioma del usuario
        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: { language }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error guardando idioma:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ language: 'es' }); // Default español
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ language: 'es' });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        return NextResponse.json({ language: currentUser?.language || 'es' });
    } catch (error) {
        console.error('Error obteniendo idioma:', error);
        return NextResponse.json({ language: 'es' });
    } finally {
        await prisma.$disconnect();
    }
}