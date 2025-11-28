import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const noticias = await prisma.noticia.findMany({
            include: {
                autor: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 25
        });

        const formatted = noticias.map(n => ({
            titulo: n.titulo,
            autor: n.autor.nick,
            fecha: n.createdAt.toLocaleDateString('es-ES'),
            contenido: n.contenido
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Error fetching noticias:', error);
        return NextResponse.json({ error: 'Error fetching noticias' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { titulo, contenido, autorNick } = await request.json();

        if (!titulo || !contenido || !autorNick) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const autor = await prisma.user.findUnique({
            where: { nick: autorNick }
        });

        if (!autor) {
            return NextResponse.json({ error: 'Author not found' }, { status: 404 });
        }

        const noticia = await prisma.noticia.create({
            data: {
                titulo,
                contenido,
                autorId: autor.id
            }
        });

        return NextResponse.json(noticia);
    } catch (error) {
        console.error('Error creating noticia:', error);
        return NextResponse.json({ error: 'Error creating noticia' }, { status: 500 });
    }
}