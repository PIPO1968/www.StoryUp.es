import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const palabras = await prisma.palabraProhibida.findMany({
            select: { palabra: true }
        });
        return NextResponse.json({ palabras: palabras.map(p => p.palabra) });
    } catch (error) {
        console.error('Error obteniendo palabras prohibidas:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}