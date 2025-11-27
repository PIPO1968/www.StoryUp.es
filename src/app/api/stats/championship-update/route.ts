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

        const { nick, centro, temporada, cantidad } = await request.json();

        if (!nick || !temporada || cantidad === undefined) {
            return NextResponse.json({ error: 'Parámetros requeridos: nick, temporada, cantidad' }, { status: 400 });
        }

        // Verificar que el usuario autenticado existe
        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Actualizar estadísticas individuales del usuario
        const userToUpdate = await prisma.user.findUnique({
            where: { nick }
        });

        if (!userToUpdate) {
            return NextResponse.json({ error: 'Usuario a actualizar no encontrado' }, { status: 404 });
        }

        const currentStatsIndividual = (userToUpdate as any).stats_individual || {};
        const seasonStatsIndividual = currentStatsIndividual[temporada] || { likes: 0 };

        seasonStatsIndividual.likes = (seasonStatsIndividual.likes || 0) + cantidad;
        currentStatsIndividual[temporada] = seasonStatsIndividual;

        // Actualizar estadísticas de centro si se proporciona centro
        let currentStatsCentro: any = {};
        if (centro) {
            // Buscar un usuario del centro para actualizar las stats de centro
            // (asumiendo que cualquier usuario del centro puede representar las stats del centro)
            const centroUser = await prisma.user.findFirst({
                where: { centro }
            });

            if (centroUser) {
                currentStatsCentro = (centroUser as any).stats_centro || {};
                const seasonStatsCentro = currentStatsCentro[temporada] || { likes: 0 };

                seasonStatsCentro.likes = (seasonStatsCentro.likes || 0) + cantidad;
                currentStatsCentro[temporada] = seasonStatsCentro;

                // Actualizar stats de centro en el usuario del centro
                await prisma.user.update({
                    where: { id: centroUser.id },
                    data: {
                        stats_centro: currentStatsCentro
                    } as any
                });
            }
        }

        // Actualizar stats individuales del usuario
        await prisma.user.update({
            where: { nick },
            data: {
                stats_individual: currentStatsIndividual
            } as any
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error actualizando estadísticas de campeonato:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}