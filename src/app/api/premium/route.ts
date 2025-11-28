import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { action, nick, solicitudId, motivo } = await request.json();

        if (action === 'approve' || action === 'reject') {
            if (!solicitudId) {
                return NextResponse.json({ error: 'ID de solicitud requerido' }, { status: 400 });
            }

            const solicitud = await prisma.solicitudPremium.findUnique({
                where: { id: solicitudId },
                include: { user: true }
            });

            if (!solicitud) {
                return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
            }

            if (action === 'approve') {
                // Activar premium
                await prisma.user.update({
                    where: { id: solicitud.userId },
                    data: { premium: true }
                });

                await prisma.solicitudPremium.update({
                    where: { id: solicitudId },
                    data: { estado: 'aprobado' }
                });

                return NextResponse.json({ message: `Premium aprobado para ${solicitud.user.nick}` });
            } else {
                await prisma.solicitudPremium.update({
                    where: { id: solicitudId },
                    data: { estado: 'rechazado' }
                });

                return NextResponse.json({ message: `Solicitud rechazada para ${solicitud.user.nick}` });
            }
        }

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