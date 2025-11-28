import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nick = searchParams.get('nick');
        const temporada = searchParams.get('temporada');
        const tipo = searchParams.get('tipo'); // 'individual', 'centro', 'docentes'

        if (!nick || !temporada || !tipo) {
            return NextResponse.json({ error: 'Parámetros requeridos: nick, temporada, tipo' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { nick }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        // Mapear tipo a type en la tabla
        let type: string;
        if (tipo === 'individual') {
            type = 'individual';
        } else if (tipo === 'docentes') {
            type = 'docentes';
        } else if (tipo === 'centro') {
            type = 'centros';
        } else {
            return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
        }

        const result = await prisma.championshipResult.findUnique({
            where: {
                userId_centro_season_type: {
                    userId: user.id,
                    centro: null as any,
                    season: temporada,
                    type: type
                }
            }
        });

        if (!result) {
            return NextResponse.json({});
        }

        return NextResponse.json({
            ganados: result.ganados,
            perdidos: result.perdidos,
            preguntasAcertadas: result.preguntasAcertadas,
            preguntasFalladas: result.preguntasFalladas,
            likes: result.likes
        });
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

        const { nick, temporada, tipo, acertadas, falladas, likes, ganado, perdido, centro } = await request.json();

        if (!nick || !temporada || !tipo) {
            return NextResponse.json({ error: 'Parámetros requeridos: nick, temporada, tipo' }, { status: 400 });
        }

        // Verificar que el usuario autenticado es el mismo que está actualizando
        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!currentUser || currentUser.nick !== nick) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        // Mapear tipo
        let type: string;
        let userId: number | null = currentUser.id;
        let centroName: string | null = null;

        if (tipo === 'estudiante') {
            type = 'individual';
        } else if (tipo === 'docente') {
            type = 'docentes';
        } else if (tipo === 'centro') {
            type = 'centros';
            userId = null;
            centroName = centro || currentUser.centro;
        } else {
            return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
        }

        // Upsert el resultado
        await prisma.championshipResult.upsert({
            where: {
                userId_centro_season_type: {
                    userId: userId as any,
                    centro: centroName as any,
                    season: temporada,
                    type: type
                }
            },
            update: {
                ganados: { increment: ganado || 0 },
                perdidos: { increment: perdido || 0 },
                preguntasAcertadas: { increment: acertadas || 0 },
                preguntasFalladas: { increment: falladas || 0 },
                likes: { increment: likes || 0 }
            },
            create: {
                userId: userId as any,
                centro: centroName as any,
                season: temporada,
                type: type,
                ganados: ganado || 0,
                perdidos: perdido || 0,
                preguntasAcertadas: acertadas || 0,
                preguntasFalladas: falladas || 0,
                likes: likes || 0
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error guardando estadísticas:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}