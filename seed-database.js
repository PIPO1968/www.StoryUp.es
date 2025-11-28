const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function seedDatabase() {
    const prisma = new PrismaClient();

    try {
        console.log('🌱 Iniciando población de base de datos...\n');

        // 1. Poblar trofeos desde JSON
        console.log('🏅 Poblando trofeos...');
        const trofeosPath = path.join(__dirname, 'src/data/trofeos.json');
        if (fs.existsSync(trofeosPath)) {
            const trofeos = JSON.parse(fs.readFileSync(trofeosPath, 'utf8'));
            for (const trofeo of trofeos) {
                await prisma.trofeo.upsert({
                    where: { id: trofeo.id },
                    update: trofeo,
                    create: trofeo
                });
            }
            console.log(`✅ ${trofeos.length} trofeos insertados`);
        }

        // 2. Poblar preguntas desde archivos JSON
        console.log('❓ Poblando preguntas...');
        const questionsDir = path.join(__dirname, 'src/questions');
        if (fs.existsSync(questionsDir)) {
            const files = fs.readdirSync(questionsDir);
            let totalPreguntas = 0;

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(questionsDir, file);
                    const preguntas = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                    // Extraer curso y asignatura del nombre del archivo
                    const match = file.match(/^([^-]+)-(.+)\.json$/);
                    if (match) {
                        const asignatura = match[1];
                        const curso = match[2];

                        for (const pregunta of preguntas) {
                            await prisma.pregunta.create({
                                data: {
                                    pregunta: pregunta.pregunta,
                                    respuesta: pregunta.respuesta,
                                    categoria: pregunta.categoria || asignatura,
                                    curso: curso,
                                    asignatura: asignatura
                                }
                            });
                            totalPreguntas++;
                        }
                    }
                }
            }
            console.log(`✅ ${totalPreguntas} preguntas insertadas`);
        }

        // 3. Crear algunos usuarios de prueba adicionales
        console.log('👥 Creando usuarios de prueba...');
        const testUsers = [
            {
                nick: 'TestDocente',
                nombre: 'Docente de Prueba',
                email: 'docente@test.com',
                centro: 'Centro Educativo Test',
                curso: '6º primaria',
                tipo: 'docente',
                password: '$2b$10$hashedpassword', // Contraseña hasheada
                premium: false,
                likes: 15,
                respuestasAcertadas: 120,
                competicionesSuperadas: 8,
                concursosGanados: 2
            },
            {
                nick: 'TestEstudiante',
                nombre: 'Estudiante de Prueba',
                email: 'estudiante@test.com',
                centro: 'Centro Educativo Test',
                curso: '3º primaria',
                tipo: 'estudiante',
                password: '$2b$10$hashedpassword',
                premium: false,
                likes: 8,
                respuestasAcertadas: 45,
                competicionesSuperadas: 3,
                concursosGanados: 0
            }
        ];

        for (const user of testUsers) {
            await prisma.user.upsert({
                where: { nick: user.nick },
                update: user,
                create: user
            });
        }
        console.log(`✅ ${testUsers.length} usuarios de prueba creados`);

        // 4. Crear algunas historias de prueba
        console.log('📖 Creando historias de prueba...');

        // Obtener IDs de usuarios creados
        const pipoUser = await prisma.user.findUnique({ where: { nick: 'PIPO68' } });
        const docenteUser = await prisma.user.findUnique({ where: { nick: 'TestDocente' } });

        if (!pipoUser || !docenteUser) {
            throw new Error('Usuarios de prueba no encontrados');
        }

        const historias = [
            {
                titulo: 'Mi aventura en el bosque mágico',
                contenido: 'Era una vez un niño llamado Juan que encontró un bosque mágico...',
                autorId: pipoUser.id,
                likes: 12
            },
            {
                titulo: 'La historia de la niña valiente',
                contenido: 'En un pueblo lejano vivía una niña muy valiente llamada María...',
                autorId: docenteUser.id,
                likes: 8
            }
        ];

        for (const historia of historias) {
            await prisma.historia.create({ data: historia });
        }
        console.log(`✅ ${historias.length} historias de prueba creadas`);

        console.log('\n🎉 ¡Base de datos poblada exitosamente!');

    } catch (error) {
        console.error('❌ Error poblando la base de datos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();