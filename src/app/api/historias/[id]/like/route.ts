import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const historia = await prisma.historia.update({
            where: { id },
            data: {
                likes: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({ likes: historia.likes });
    } catch (error) {
        console.error('Error liking historia:', error);
        return NextResponse.json({ error: 'Error liking historia' }, { status: 500 });
    }
}