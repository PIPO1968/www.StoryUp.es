import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const temporada = searchParams.get('temporada');
        const tipo = searchParams.get('tipo'); // 'individual', 'centro'

        if (!temporada || !tipo) {
            return NextResponse.json({ error: 'Parámetros requeridos: temporada, tipo' }, { status: 400 });
        }

        // Obtener todos los usuarios
        const users = await prisma.user.findMany();

        const tabla: Record<string, number> = {};

        // Procesar estadísticas de cada usuario
        for (const user of users) {
            let statsField: any;
            if (tipo === 'individual') {
                statsField = (user as any).stats_individual;
            } else if (tipo === 'centro') {
                statsField = (user as any).stats_centro;
            } else {
                continue;
            }

            const allStats = statsField || {};
            const seasonStats = allStats[temporada] || {};

            if (tipo === 'individual') {
                // Para tabla individual, usar nick como clave
                if (seasonStats.likes) {
                    tabla[user.nick] = seasonStats.likes;
                }
            } else if (tipo === 'centro' && user.centro) {
                // Para tabla centro, usar centro como clave
                if (seasonStats.likes) {
                    tabla[user.centro] = (tabla[user.centro] || 0) + seasonStats.likes;
                }
            }
        }

        return NextResponse.json(tabla);
    } catch (error) {
        console.error('Error obteniendo tabla de campeonato:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}