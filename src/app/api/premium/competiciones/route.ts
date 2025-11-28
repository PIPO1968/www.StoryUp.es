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

        const competicionData = await prisma.competicionPremium?.findUnique?.({
            where: { userId: decoded.userId }
        });

        return NextResponse.json(competicionData || { victorias: 0, participaciones: 0, puntuacionTotal: 0 });
    } catch (error) {
        console.error('Error obteniendo competiciones premium:', error);
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

        const { victorias, participaciones, puntuacionTotal } = await request.json();

        const competicionData = await prisma.competicionPremium?.upsert?.({
            where: { userId: decoded.userId },
            update: {
                victorias: victorias ?? undefined,
                participaciones: participaciones ?? undefined,
                puntuacionTotal: puntuacionTotal ?? undefined
            },
            create: {
                userId: decoded.userId,
                victorias: victorias ?? 0,
                participaciones: participaciones ?? 0,
                puntuacionTotal: puntuacionTotal ?? 0
            }
        });

        return NextResponse.json(competicionData);
    } catch (error) {
        console.error('Error guardando competiciones premium:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}