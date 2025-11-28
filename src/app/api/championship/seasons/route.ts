import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const seasons = await prisma.championshipResult.findMany({
            select: {
                season: true
            },
            distinct: ['season']
        });

        const seasonList = seasons.map(s => s.season).sort((a, b) => b.localeCompare(a));

        return NextResponse.json(seasonList);
    } catch (error) {
        console.error('Error obteniendo temporadas:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}