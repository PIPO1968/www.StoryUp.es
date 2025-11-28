import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const season = searchParams.get('season');

        if (!season) {
            return NextResponse.json({ error: 'Parámetro season requerido' }, { status: 400 });
        }

        await prisma.championshipResult.deleteMany({
            where: {
                season: season
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reseteando temporada:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}