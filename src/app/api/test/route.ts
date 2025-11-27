import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const count = await prisma.pregunta.count();
        return Response.json({ count });
    } catch (error) {
        console.error('Error counting preguntas:', error);
        return Response.json({ error: 'Error interno' }, { status: 500 });
    }
}