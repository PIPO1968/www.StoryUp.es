import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { nick, password } = await request.json();

        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { nick }
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Devolver usuario sin contraseña
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}