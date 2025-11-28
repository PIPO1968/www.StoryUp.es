import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nick = searchParams.get('nick');

        if (!nick) {
            return NextResponse.json({ error: 'Nick required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { nick } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userTrofeos = await prisma.userTrofeo.findMany({
            where: { userId: user.id }
        });

        const trofeosDesbloqueados = userTrofeos.filter(t => t.desbloqueado).map(t => t.trofeoId);
        const trofeosBloqueados = userTrofeos.filter(t => !t.desbloqueado).map(t => t.trofeoId);

        return NextResponse.json({ trofeosDesbloqueados, trofeosBloqueados });
    } catch (error) {
        console.error('Error fetching user trofeos:', error);
        return NextResponse.json({ error: 'Error fetching user trofeos' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nick, trofeosDesbloqueados, trofeosBloqueados } = body;

        const user = await prisma.user.findUnique({ where: { nick } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Delete existing
        await prisma.userTrofeo.deleteMany({ where: { userId: user.id } });

        // Create new
        const trofeos: { userId: number; trofeoId: number; desbloqueado: boolean }[] = [];
        trofeosDesbloqueados.forEach((id: number) => {
            trofeos.push({ userId: user.id, trofeoId: id, desbloqueado: true });
        });
        trofeosBloqueados.forEach((id: number) => {
            trofeos.push({ userId: user.id, trofeoId: id, desbloqueado: false });
        });

        await prisma.userTrofeo.createMany({ data: trofeos });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user trofeos:', error);
        return NextResponse.json({ error: 'Error updating user trofeos' }, { status: 500 });
    }
}