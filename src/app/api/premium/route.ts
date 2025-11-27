import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { action, nick } = await request.json();

        if (!nick) {
            return NextResponse.json({ error: 'Nick requerido' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { nick },
            select: { id: true, nick: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        if (action === 'activate') {
            // Activar premium por 1 año
            const fechaExpiracion = new Date();
            fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);

            await prisma.user.update({
                where: { nick },
                data: { premium: true }
            });

            return NextResponse.json({
                message: `Premium activado para ${nick} hasta ${fechaExpiracion.toISOString().split('T')[0]}`
            });
        } else if (action === 'deactivate') {
            await prisma.user.update({
                where: { nick },
                data: { premium: false }
            });

            return NextResponse.json({ message: `Premium desactivado para ${nick}` });
        } else if (action === 'check') {
            const userData = await prisma.user.findUnique({
                where: { nick },
                select: { premium: true }
            });

            return NextResponse.json({
                premium: userData?.premium || false
            });
        }

        return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
    } catch (error) {
        console.error('Error en premium:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}