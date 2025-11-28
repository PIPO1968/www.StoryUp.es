import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Obtener usuarios premium activos
        const premiumUsers = await prisma.premiumData.findMany({
            where: {
                activo: true,
                fechaExpiracion: {
                    gt: new Date()
                }
            },
            include: {
                user: {
                    include: {
                        historias: true,
                        amigosComoUser: true,
                        amigosComoAmigo: true,
                        userTrofeos: true,
                        competicionPremium: true
                    }
                }
            }
        });

        const usuariosPremium = premiumUsers.map(pu => {
            const user = pu.user;
            const puntos = calcularPuntosUsuario(user);

            return {
                nick: user.nick,
                avatar: user.avatar,
                puntos: puntos,
                historiasCreadas: user.historias.length,
                preguntasAcertadas: user.respuestasAcertadas || 0,
                amigos: user.amigosComoUser.length + user.amigosComoAmigo.length,
                medallas: user.userTrofeos.length
            };
        });

        // Ordenar por puntos descendente
        usuariosPremium.sort((a, b) => b.puntos - a.puntos);

        return NextResponse.json(usuariosPremium);
    } catch (error) {
        console.error('Error fetching liga premium:', error);
        return NextResponse.json({ error: 'Error fetching liga premium' }, { status: 500 });
    }
}

function calcularPuntosUsuario(user: any): number {
    let puntos = 0;

    // Puntos por historias creadas (10 puntos cada una)
    puntos += user.historias.length * 10;

    // Puntos por preguntas acertadas (5 puntos cada una)
    puntos += (user.respuestasAcertadas || 0) * 5;

    // Puntos por amigos (20 puntos cada amigo)
    const amigosCount = user.amigosComoUser.length + user.amigosComoAmigo.length;
    puntos += amigosCount * 20;

    // Puntos por medallas (50 puntos cada medalla)
    puntos += user.userTrofeos.length * 50;

    // Puntos por participación en competiciones premium
    if (user.competicionesPremium) {
        puntos += user.competicionesPremium.puntuacionTotal || 0;
    }

    return puntos;
}