import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const session = await prisma.sesionUsuario.findFirst({
            where: { token: sessionToken }
        });

        if (!session) {
            return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const torneos = await prisma.torneo.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(torneos);
    } catch (error) {
        console.error('Error getting torneos:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const session = await prisma.sesionUsuario.findFirst({
            where: { token: sessionToken },
            include: { user: true }
        });

        if (!session) {
            return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
        }

        const { action, torneoId, aciertos, puntuacion } = await request.json();

        if (action === 'complete') {
            // Update tournament results
            const torneo = await prisma.torneo.findUnique({
                where: { id: torneoId }
            });

            if (!torneo) {
                return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 });
            }

            const resultados = torneo.resultados as any[] || [];
            resultados.push({
                nick: session.user.nick,
                aciertos,
                puntuacion
            });

            // Sort by puntuacion descending
            resultados.sort((a, b) => b.puntuacion - a.puntuacion);

            // Check if tournament should end
            const now = new Date();
            const shouldEnd = now >= torneo.fechaFin;

            let updatedTorneo;
            if (shouldEnd && resultados.length > 0) {
                // End tournament and set winner
                const winnerNick = resultados[0].nick;
                const winner = await prisma.user.findUnique({
                    where: { nick: winnerNick }
                });

                updatedTorneo = await prisma.torneo.update({
                    where: { id: torneoId },
                    data: {
                        resultados,
                        estado: 'finalizado',
                        ganadorId: winner?.id
                    }
                });

                // Update winner's stats if it's a monthly tournament
                if (torneo.tipo === 'mensual' && winner) {
                    await prisma.userStats.upsert({
                        where: { userId: winner.id },
                        update: { victoriasTorneos: { increment: 1 } },
                        create: { userId: winner.id, victoriasTorneos: 1 }
                    });
                }
            } else {
                updatedTorneo = await prisma.torneo.update({
                    where: { id: torneoId },
                    data: { resultados }
                });
            }

            // Update user's tournament stats
            await prisma.userStats.upsert({
                where: { userId: session.user.id },
                update: {
                    participacionesTorneos: { increment: 1 },
                    puntuacionTotal: { increment: puntuacion }
                },
                create: {
                    userId: session.user.id,
                    participacionesTorneos: 1,
                    puntuacionTotal: puntuacion
                }
            });

            return NextResponse.json({ success: true, torneo: updatedTorneo });
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    } catch (error) {
        console.error('Error updating torneo:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}