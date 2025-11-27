const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function migrateUsers() {
    try {
        console.log('Migrando usuarios de localStorage a PostgreSQL...');

        // Nota: Como localStorage es del lado cliente, este script asume que tienes los usuarios en un archivo JSON
        // Para migrar, exporta los usuarios desde la consola del navegador: console.log(JSON.stringify(localStorage.getItem('users')))
        // Y guárdalos en un archivo users.json en la raíz del proyecto

        if (!fs.existsSync('users.json')) {
            console.log('No se encontró users.json. Exporta los usuarios desde localStorage primero.');
            return;
        }

        const usersData = fs.readFileSync('users.json', 'utf-8');
        const users = JSON.parse(usersData);

        console.log(`Migrando ${users.length} usuarios...`);

        for (const user of users) {
            // Mapear campos de localStorage a DB
            const userData = {
                nick: user.nick,
                nombre: user.nombre || null,
                email: user.email || null,
                password: user.password || null,
                avatar: user.avatar || null,
                centro: user.centro || null,
                curso: user.curso || null,
                tipo: user.tipo || 'estudiante',
                fechaInscripcion: user.fechaInscripcion ? new Date(user.fechaInscripcion) : new Date(),
                likes: user.likes || 0,
                respuestasAcertadas: user.respuestasAcertadas || 0,
                competicionesSuperadas: user.competicionesSuperadas || 0,
                concursosGanados: user.concursosGanados || 0,
                comentariosRecibidos: user.comentariosRecibidos || 0,
                historiasCreadas: user.historiasCreadas || 0,
                anosEnStoryUp: user.anosEnStoryUp || 0,
                premium: user.premium || false
            };

            await prisma.user.create({
                data: userData
            });
        }

        console.log('Migración de usuarios completada.');
    } catch (error) {
        console.error('Error migrando usuarios:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateUsers();