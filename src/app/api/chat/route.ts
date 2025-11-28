import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nick = searchParams.get('nick');

        if (!nick) {
            return NextResponse.json({ error: 'Nick required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { nick } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const chats = await prisma.chat.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        const messages = chats.map(c => {
            const parts = c.mensaje.split(': ');
            const direction = parts[0];
            const text = parts.slice(1).join(': ');
            let from, to;
            if (direction.startsWith('To ')) {
                from = user.nick;
                to = direction.replace('To ', '');
            } else if (direction.startsWith('From ')) {
                to = user.nick;
                from = direction.replace('From ', '');
            }
            return { from, to, text, fecha: c.createdAt.toLocaleString('es-ES') };
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching chat:', error);
        return NextResponse.json({ error: 'Error fetching chat' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { from, to, text } = body;

        const fromUser = await prisma.user.findUnique({ where: { nick: from } });
        if (!fromUser) {
            return NextResponse.json({ error: 'From user not found' }, { status: 404 });
        }

        const toUser = await prisma.user.findUnique({ where: { nick: to } });
        if (!toUser) {
            return NextResponse.json({ error: 'To user not found' }, { status: 404 });
        }

        const message = `To ${to}: ${text}`;
        await prisma.chat.create({
            data: {
                userId: fromUser.id,
                mensaje: message
            }
        });

        const messageTo = `From ${from}: ${text}`;
        await prisma.chat.create({
            data: {
                userId: toUser.id,
                mensaje: messageTo
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
    }
}