import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nick, likes } = body;

        const user = await prisma.user.findUnique({ where: { nick } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { likes }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}