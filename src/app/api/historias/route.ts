import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const historias = await prisma.historia.findMany({
            include: {
                autor: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 25
        });

        const formatted = historias.map(h => ({
            id: h.id,
            titulo: h.titulo,
            autor: h.autor.nick,
            fecha: h.createdAt.toLocaleDateString('es-ES'),
            likes: h.likes,
            comentarios: [] // No hay modelo de comentarios, así que vacío
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Error fetching historias:', error);
        return NextResponse.json({ error: 'Error fetching historias' }, { status: 500 });
    }
}