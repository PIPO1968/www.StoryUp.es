import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { nombre, nick, centro, curso, tipo, email, password } = await request.json();

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { nick }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'El nick ya está en uso' }, { status: 400 });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                nombre: nombre || null,
                nick,
                centro: centro || null,
                curso: curso || null,
                tipo: tipo || 'estudiante',
                email: email || null,
                password: hashedPassword,
                fechaInscripcion: new Date(),
                likes: 0,
                respuestasAcertadas: 0,
                competicionesSuperadas: 0,
                concursosGanados: 0,
                comentariosRecibidos: 0,
                historiasCreadas: 0,
                anosEnStoryUp: 0,
                premium: false
            } as any
        });

        return NextResponse.json({ message: 'Usuario registrado exitosamente', user: { id: user.id, nick: user.nick } });
    } catch (error) {
        console.error('Error registrando usuario:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}