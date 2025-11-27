import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nick = searchParams.get('nick');
        const temporada = searchParams.get('temporada');
        const tipo = searchParams.get('tipo'); // 'individual', 'centro', 'docente'

        if (!nick || !temporada || !tipo) {
            return NextResponse.json({ error: 'Parámetros requeridos: nick, temporada, tipo' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { nick }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const fieldName = `stats_${tipo}`;
        const allStats = (user as any)[fieldName] || {};

        // Buscar estadísticas de la temporada específica
        const seasonStats = allStats[temporada] || {};

        return NextResponse.json(seasonStats);
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

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

        const { nick, temporada, tipo, stats } = await request.json();

        if (!nick || !temporada || !tipo || !stats) {
            return NextResponse.json({ error: 'Parámetros requeridos: nick, temporada, tipo, stats' }, { status: 400 });
        }

        // Verificar que el usuario autenticado es el mismo que está actualizando
        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!currentUser || currentUser.nick !== nick) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        const fieldName = `stats_${tipo}`;
        const currentStats = (currentUser as any)[fieldName] || {};

        // Actualizar estadísticas de la temporada específica
        currentStats[temporada] = {
            ...currentStats[temporada],
            ...stats,
            updatedAt: new Date().toISOString()
        };

        const updateData: any = {};
        updateData[fieldName] = currentStats;

        await prisma.user.update({
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