import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signToken } from '@/utils/jwt';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        console.log('Login attempt');
        const body = await request.json();
        console.log('Body:', body);
        const { nick, password } = body;

        console.log('Nick:', nick, 'Password provided:', !!password);

        if (!nick || !password) {
            return NextResponse.json({ error: 'Nick y contraseña requeridos' }, { status: 400 });
        }

        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { nick },
            select: {
                id: true,
                nick: true,
                nombre: true,
                email: true,
                centro: true,
                curso: true,
                tipo: true,
                fechaInscripcion: true,
                likes: true,
                respuestasAcertadas: true,
                competicionesSuperadas: true,
                concursosGanados: true,
                comentariosRecibidos: true,
                historiasCreadas: true,
                anosEnStoryUp: true,
                premium: true,
                language: true,
                password: true
            }
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Crear token JWT
        const token = signToken({ userId: user.id, nick: user.nick });

        // Devolver usuario sin contraseña
        const { password: _, ...userWithoutPassword } = user;

        const response = NextResponse.json({ user: userWithoutPassword });

        // Setear cookie con el token
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 días
        });

        return response;
    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}