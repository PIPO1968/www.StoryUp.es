import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const torneoData = await prisma.torneoPremium.findUnique({
            where: { userId: decoded.userId }
        });

        return NextResponse.json(torneoData || {});
    } catch (error) {
        console.error('Error obteniendo torneos premium:', error);
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

        const { torneos, lastReset, torneoActivo } = await request.json();

        const torneoData = await prisma.torneoPremium?.upsert({
            where: { userId: decoded.userId },
            update: {
                torneos: torneos ?? undefined,
                lastReset: lastReset ? new Date(lastReset) : undefined,
                torneoActivo: torneoActivo ?? undefined
            },
            create: {
                userId: decoded.userId,
                torneos: torneos ?? [],
                lastReset: lastReset ? new Date(lastReset) : undefined,
                torneoActivo: torneoActivo ?? null
            }
        });

        return NextResponse.json(torneoData);
    } catch (error) {
        console.error('Error guardando torneos premium:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}