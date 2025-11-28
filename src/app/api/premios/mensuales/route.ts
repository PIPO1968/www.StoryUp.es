import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        if (!year || !month) {
            return NextResponse.json({ error: 'Year and month required' }, { status: 400 });
        }

        const premios = await prisma.premioMensual.findMany({
            where: {
                year: parseInt(year),
                month: parseInt(month)
            }
        });

        return NextResponse.json(premios);
    } catch (error) {
        console.error('Error fetching premios:', error);
        return NextResponse.json({ error: 'Error fetching premios' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { year, month, centro, posicion, titulo } = body;

        const premio = await prisma.premioMensual.create({
            data: {
                year: parseInt(year),
                month: parseInt(month),
                centro,
                posicion,
                titulo
            }
        });

        return NextResponse.json(premio);
    } catch (error) {
        console.error('Error creating premio:', error);
        return NextResponse.json({ error: 'Error creating premio' }, { status: 500 });
    }
}