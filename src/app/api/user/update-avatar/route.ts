import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const userId = decoded.userId;

        const { avatar } = await request.json();

        if (!avatar) {
            return NextResponse.json({ error: 'Avatar es requerido' }, { status: 400 });
        }

        // Actualizar el avatar del usuario
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatar },
            select: {
                id: true,
                nick: true,
                email: true,
                avatar: true,
                premium: true,
                tipo: true,
                language: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error('Error updating avatar:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}