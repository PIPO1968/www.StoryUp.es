import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const nick = searchParams.get('nick');

        if (nick) {
            const user = await prisma.user.findUnique({ where: { nick } });
            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            const premiumData = await prisma.premiumData.findUnique({
                where: { userId: user.id }
            });
            return NextResponse.json(premiumData || {});
        } else {
            const token = request.cookies.get('auth-token')?.value;
            if (!token) {
                return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
            }

            const decoded = verifyToken(token);
            if (!decoded) {
                return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
            }

            const premiumData = await prisma.premiumData.findUnique({
                where: { userId: decoded.userId }
            });

            return NextResponse.json(premiumData || {});
        }
    } catch (error) {
        console.error('Error obteniendo datos premium:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth-token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        const { fechaInicio, fechaExpiracion, activo } = await request.json();

        const premiumData = await prisma.premiumData.upsert({
            where: { userId: decoded.userId },
            update: {
                fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
                fechaExpiracion: fechaExpiracion ? new Date(fechaExpiracion) : undefined,
                activo: activo ?? undefined
            },
            create: {
                userId: decoded.userId,
                fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
                fechaExpiracion: fechaExpiracion ? new Date(fechaExpiracion) : undefined,
                activo: activo ?? false
            }
        });

        return NextResponse.json(premiumData);
    } catch (error) {
        console.error('Error guardando datos premium:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}