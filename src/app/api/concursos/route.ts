import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const concursos = await prisma.concurso.findMany({
            orderBy: { numero: 'desc' }
        });
        return NextResponse.json(concursos);
    } catch (error) {
        console.error('Error fetching concursos:', error);
        return NextResponse.json({ error: 'Error fetching concursos' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (body.id) {
            // Update
            const { id, ganador } = body;
            const concurso = await prisma.concurso.update({
                where: { id: parseInt(id) },
                data: { ganador }
            });
            return NextResponse.json(concurso);
        } else {
            // Create
            const { numero, titulo, texto, inicio, fin, autor, ganador, fechaFinal } = body;

            const user = await prisma.user.findUnique({ where: { nick: autor } });
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const concurso = await prisma.concurso.create({
                data: {
                    numero,
                    titulo,
                    texto,
                    inicio: new Date(inicio),
                    fin: new Date(fin),
                    autor,
                    ganador,
                    fechaFinal: fechaFinal ? new Date(fechaFinal) : null,
                    userId: user.id
                }
            });
            return NextResponse.json(concurso);
        }
    } catch (error) {
        console.error('Error creating/updating concurso:', error);
        return NextResponse.json({ error: 'Error creating/updating concurso' }, { status: 500 });
    }
}