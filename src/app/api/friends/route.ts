import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nick = searchParams.get('nick');
        const action = searchParams.get('action');

        if (!nick) {
            return NextResponse.json({ error: 'Nick requerido' }, { status: 400 });
        }

        if (action === 'friends') {
            // Get friends
            const friends = await prisma.amigo.findMany({
                where: { user: { nick } },
                include: { amigo: true }
            });
            return NextResponse.json({ friends: friends.map(f => f.amigo) });
        }

        if (action === 'requests') {
            // Get pending requests (simplified, since no request model)
            return NextResponse.json({ requests: [] });
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    } catch (error) {
        console.error('Error en friends GET:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { action, userNick, friendNick } = await request.json();

        if (!userNick || !friendNick) {
            return NextResponse.json({ error: 'Nicks requeridos' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { nick: userNick } });
        const friend = await prisma.user.findUnique({ where: { nick: friendNick } });

        if (!user || !friend) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        if (action === 'add') {
            // Add friend
            await prisma.amigo.create({
                data: {
                    userId: user.id,
                    amigoId: friend.id
                }
            });
            await prisma.amigo.create({
                data: {
                    userId: friend.id,
                    amigoId: user.id
                }
            });
            return NextResponse.json({ message: 'Amigo agregado' });
        }

        if (action === 'remove') {
            // Remove friend
            await prisma.amigo.deleteMany({
                where: {
                    OR: [
                        { userId: user.id, amigoId: friend.id },
                        { userId: friend.id, amigoId: user.id }
                    ]
                }
            });
            return NextResponse.json({ message: 'Amigo removido' });
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    } catch (error) {
        console.error('Error en friends POST:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}