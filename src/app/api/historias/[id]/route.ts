import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const historia = await prisma.historia.findUnique({
            where: { id },
            include: {
                autor: true
            }
        });

        if (!historia) {
            return NextResponse.json({ error: 'Historia not found' }, { status: 404 });
        }

        const formatted = {
            id: historia.id,
            titulo: historia.titulo,
            autor: historia.autor.nick,
            fecha: historia.createdAt.toLocaleDateString('es-ES'),
            contenido: historia.contenido,
            likes: historia.likes,
            likedBy: [], // No hay modelo para likedBy
            comentarios: [] // No hay modelo para comentarios
        };

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Error fetching historia:', error);
        return NextResponse.json({ error: 'Error fetching historia' }, { status: 500 });
    }
}