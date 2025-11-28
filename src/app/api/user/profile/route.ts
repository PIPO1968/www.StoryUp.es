import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nick = searchParams.get('nick');

        if (!nick) {
            return NextResponse.json({ error: 'Nick parameter is required' }, { status: 400 });
        }

        // Buscar el usuario por nick
        const user = await prisma.user.findUnique({
            where: { nick: nick },
            include: {
                historias: {
                    select: {
                        id: true,
                        titulo: true,
                        likes: true
                    }
                },
                amigosComoUser: {
                    select: {
                        id: true,
                        amigo: {
                            select: {
                                nick: true,
                                nombre: true
                            }
                        }
                    }
                },
                amigosComoAmigo: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                nick: true,
                                nombre: true
                            }
                        }
                    }
                },
                stats: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calcular estadísticas adicionales
        const totalLikes = user.historias.reduce((sum: number, historia: any) => sum + (historia.likes || 0), 0);
        const totalAmigos = user.amigosComoUser.length + user.amigosComoAmigo.length;

        // Formatear respuesta
        const userProfile = {
            id: user.id,
            nick: user.nick,
            nombre: user.nombre,
            email: user.email,
            centro: user.centro,
            curso: user.curso,
            tipo: user.tipo,
            avatar: user.avatar,
            premium: user.premium,
            fechaInscripcion: user.fechaInscripcion,
            likes: totalLikes,
            respuestasAcertadas: user.respuestasAcertadas || 0,
            preguntasFalladas: user.stats?.preguntasFalladas || 0,
            competicionesSuperadas: user.competicionesSuperadas || 0,
            concursosGanados: user.concursosGanados || 0,
            amigos: totalAmigos,
            historias: user.historias.length,
            comentariosRecibidos: user.comentariosRecibidos || 0,
            trofeos: [], // No hay relación directa con trofeos
            regalosEnviados: 0, // No implementado aún
            regalosRecibidos: 0, // No implementado aún
            compras: 0, // No implementado aún
            torneosGanados: 0 // No implementado aún
        };

        return NextResponse.json({ user: userProfile });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}