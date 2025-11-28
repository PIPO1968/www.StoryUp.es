const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createTestUsersForCompetitions() {
    const prisma = new PrismaClient();

    try {
        console.log('🏆 Creando usuarios de prueba para competiciones...\n');

        // Usuarios de prueba con diferentes centros y tipos
        const testUsers = [
            // Estudiantes de diferentes centros
            {
                nick: 'AlumnoCentroA1',
                nombre: 'María García',
                email: 'maria.centroa@test.com',
                centro: 'CEIP Centro A',
                curso: '3º primaria',
                tipo: 'estudiante',
                password: 'password123',
                likes: 25,
                respuestasAcertadas: 45,
                competicionesSuperadas: 3,
                concursosGanados: 1
            },
            {
                nick: 'AlumnoCentroA2',
                nombre: 'Carlos López',
                email: 'carlos.centroa@test.com',
                centro: 'CEIP Centro A',
                curso: '4º primaria',
                tipo: 'estudiante',
                password: 'password123',
                likes: 18,
                respuestasAcertadas: 32,
                competicionesSuperadas: 2,
                concursosGanados: 0
            },
            {
                nick: 'AlumnoCentroB1',
                nombre: 'Ana Martínez',
                email: 'ana.centrob@test.com',
                centro: 'CEIP Centro B',
                curso: '2º primaria',
                tipo: 'estudiante',
                password: 'password123',
                likes: 31,
                respuestasAcertadas: 58,
                competicionesSuperadas: 4,
                concursosGanados: 2
            },
            {
                nick: 'AlumnoCentroB2',
                nombre: 'Pedro Sánchez',
                email: 'pedro.centrob@test.com',
                centro: 'CEIP Centro B',
                curso: '5º primaria',
                tipo: 'estudiante',
                password: 'password123',
                likes: 22,
                respuestasAcertadas: 41,
                competicionesSuperadas: 3,
                concursosGanados: 1
            },
            {
                nick: 'AlumnoCentroC1',
                nombre: 'Lucía Fernández',
                email: 'lucia.centroc@test.com',
                centro: 'CEIP Centro C',
                curso: '1º primaria',
                tipo: 'estudiante',
                password: 'password123',
                likes: 15,
                respuestasAcertadas: 28,
                competicionesSuperadas: 1,
                concursosGanados: 0
            },

            // Docentes de diferentes centros
            {
                nick: 'DocenteCentroA',
                nombre: 'Profesor Antonio Ruiz',
                email: 'antonio.docente@test.com',
                centro: 'CEIP Centro A',
                curso: '6º primaria',
                tipo: 'docente',
                password: 'password123',
                likes: 45,
                respuestasAcertadas: 78,
                competicionesSuperadas: 6,
                concursosGanados: 3
            },
            {
                nick: 'DocenteCentroB',
                nombre: 'Profesora Elena Gómez',
                email: 'elena.docente@test.com',
                centro: 'CEIP Centro B',
                curso: '6º primaria',
                tipo: 'docente',
                password: 'password123',
                likes: 52,
                respuestasAcertadas: 89,
                competicionesSuperadas: 7,
                concursosGanados: 4
            },
            {
                nick: 'DocenteCentroC',
                nombre: 'Profesor Miguel Torres',
                email: 'miguel.docente@test.com',
                centro: 'CEIP Centro C',
                curso: '6º primaria',
                tipo: 'docente',
                password: 'password123',
                likes: 38,
                respuestasAcertadas: 65,
                competicionesSuperadas: 5,
                concursosGanados: 2
            }
        ];

        console.log(`📝 Registrando ${testUsers.length} usuarios de prueba...`);

        for (const user of testUsers) {
            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Crear usuario
            await prisma.user.create({
                data: {
                    nombre: user.nombre,
                    nick: user.nick,
                    centro: user.centro,
                    curso: user.curso,
                    tipo: user.tipo,
                    email: user.email,
                    password: hashedPassword,
                    fechaInscripcion: new Date(),
                    likes: user.likes,
                    respuestasAcertadas: user.respuestasAcertadas,
                    competicionesSuperadas: user.competicionesSuperadas,
                    concursosGanados: user.concursosGanados,
                    comentariosRecibidos: 0,
                    historiasCreadas: 0,
                    anosEnStoryUp: 0,
                    premium: false
                }
            });

            console.log(`✅ ${user.nick} (${user.tipo}) - ${user.centro}`);
        }

        // Crear algunas historias de prueba
        console.log('\n📖 Creando historias de prueba...');
        const historias = [
            {
                titulo: 'Mi aventura en el bosque encantado',
                contenido: 'Era una vez un niño llamado Juan que encontró un bosque mágico lleno de criaturas fantásticas...',
                autorId: 1, // AlumnoCentroA1
                likes: 12
            },
            {
                titulo: 'La historia de la niña valiente',
                contenido: 'En un pueblo lejano vivía una niña muy valiente llamada María que decidió explorar el mundo...',
                autorId: 2, // AlumnoCentroA2
                likes: 8
            },
            {
                titulo: 'El viaje del pequeño explorador',
                contenido: 'Carlos era un niño curioso que siempre quería descubrir cosas nuevas...',
                autorId: 3, // AlumnoCentroB1
                likes: 15
            }
        ];

        for (const historia of historias) {
            await prisma.historia.create({ data: historia });
        }
        console.log(`✅ ${historias.length} historias de prueba creadas`);

        console.log('\n🎉 ¡Usuarios de prueba para competiciones creados exitosamente!');
        console.log('\n📊 Resumen:');
        console.log('- 5 estudiantes de 3 centros diferentes');
        console.log('- 3 docentes de 3 centros diferentes');
        console.log('- 3 historias de prueba');
        console.log('\n💡 Ahora las competiciones mostrarán datos cuando visites /competiciones');

    } catch (error) {
        console.error('❌ Error creando usuarios de prueba:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUsersForCompetitions();