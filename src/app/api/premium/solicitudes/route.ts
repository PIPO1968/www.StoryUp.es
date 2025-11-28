import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const solicitudes = await prisma.solicitudPremium.findMany({
            include: { user: { select: { nick: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(solicitudes);
    } catch (error) {
        console.error('Error obteniendo solicitudes:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: NextRequest) {
    try {
        const { nick, email, estado, tipo, precio } = await request.json();

        // Buscar usuario por nick
        const user = await prisma.user.findUnique({
            where: { nick }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const solicitud = await prisma.solicitudPremium.create({
            data: {
                userId: user.id,
                estado: estado || 'pendiente',
                // tipo y precio no están en el modelo, pero podemos agregar si es necesario
            }
        });

        return NextResponse.json(solicitud);
    } catch (error) {
        console.error('Error creando solicitud:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}