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

        const { type, data } = await request.json();
        // type puede ser: 'individual', 'centro', 'docente'
        // data es el objeto con las estadísticas

        // Por ahora, guardamos en un campo JSON en el usuario
        // En el futuro podríamos crear tablas específicas para estadísticas
        const fieldName = `stats_${type}`;
        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Actualizar el campo de estadísticas
        const updateData: any = {};
        updateData[fieldName] = data;

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: updateData
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error guardando estadísticas:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

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

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const fieldName = `stats_${type}`;
        const stats = (currentUser as any)[fieldName] || {};

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}