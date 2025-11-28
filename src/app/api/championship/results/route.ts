import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const season = searchParams.get('season');
        const type = searchParams.get('type'); // 'centros', 'individual', 'docentes'

        if (!season || !type) {
            return NextResponse.json({ error: 'Parámetros requeridos: season, type' }, { status: 400 });
        }

        const results = await prisma.championshipResult.findMany({
            where: {
                season: season,
                type: type
            },
            include: {
                user: true
            },
            orderBy: {
                likes: 'desc'
            }
        });

        // Formatear los resultados
        const formatted = results.map((result: typeof results[number]) => {
            if (type === 'centros') {
                return {
                    centro: result.centro,
                    ganados: result.ganados,
                    perdidos: result.perdidos,
                    preguntasAcertadas: result.preguntasAcertadas,
                    preguntasFalladas: result.preguntasFalladas,
                    likes: result.likes
                };
            } else {
                return {
                    nick: result.user?.nick,
                    escudo: result.user?.avatar || '👤',
                    ganados: result.ganados,
                    perdidos: result.perdidos,
                    preguntasAcertadas: result.preguntasAcertadas,
                    preguntasFalladas: result.preguntasFalladas,
                    likes: result.likes
                };
            }
        });

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Error obteniendo resultados:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}