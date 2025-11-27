import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const count = await prisma.pregunta.count();
        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error counting preguntas:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}