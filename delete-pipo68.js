const { PrismaClient } = require('@prisma/client');

async function deletePIPO68() {
    const prisma = new PrismaClient();

    try {
        console.log('🗑️  Eliminando usuario PIPO68 y todos sus datos relacionados...\n');

        // Primero verificar que existe
        const user = await prisma.user.findUnique({
            where: { nick: 'PIPO68' },
            include: {
                historias: true,
                noticias: true,
                amigosComoUser: true,
                amigosComoAmigo: true,
                chat: true,
                campeonatos: true,
                concursos: true,
                solicitudes: true,
                sesiones: true,
                premios: true,
                torneosGanados: true,
                stats: true
            }
        });

        if (!user) {
            console.log('❌ Usuario PIPO68 no encontrado en la base de datos');
            return;
        }

        console.log('📊 Datos encontrados para PIPO68:');
        console.log(`   - Historias: ${user.historias.length}`);
        console.log(`   - Noticias: ${user.noticias.length}`);
        console.log(`   - Amigos (como user): ${user.amigosComoUser.length}`);
        console.log(`   - Amigos (como amigo): ${user.amigosComoAmigo.length}`);
        console.log(`   - Mensajes de chat: ${user.chat.length}`);
        console.log(`   - Campeonatos: ${user.campeonatos.length}`);
        console.log(`   - Concursos: ${user.concursos.length}`);
        console.log(`   - Solicitudes premium: ${user.solicitudes.length}`);
        console.log(`   - Sesiones: ${user.sesiones.length}`);
        console.log(`   - Premios: ${user.premios.length}`);
        console.log(`   - Torneos ganados: ${user.torneosGanados.length}`);
        console.log(`   - Estadísticas: ${user.stats ? 1 : 0}`);

        // Eliminar en orden para respetar las restricciones de clave foránea
        console.log('\n🗑️  Eliminando datos relacionados...');

        // 1. Eliminar estadísticas
        if (user.stats) {
            await prisma.userStats.delete({
                where: { userId: user.id }
            });
            console.log('✅ Estadísticas eliminadas');
        }

        // 2. Eliminar premios
        if (user.premios.length > 0) {
            await prisma.premioMensual.deleteMany({
                where: { userId: user.id }
            });
            console.log('✅ Premios eliminados');
        }

        // 3. Eliminar sesiones
        if (user.sesiones.length > 0) {
            await prisma.sesionUsuario.deleteMany({
                where: { userId: user.id }
            });
            console.log('✅ Sesiones eliminadas');
        }

        // 4. Eliminar solicitudes premium
        if (user.solicitudes.length > 0) {
            await prisma.solicitudPremium.deleteMany({
                where: { userId: user.id }
            });
            console.log('✅ Solicitudes premium eliminadas');
        }

        // 5. Eliminar torneos ganados (primero quitar la referencia)
        if (user.torneosGanados.length > 0) {
            await prisma.torneo.updateMany({
                where: { ganadorId: user.id },
                data: { ganadorId: null }
            });
            console.log('✅ Referencias a torneos ganados eliminadas');
        }

        // 6. Eliminar amigos (relaciones bidireccionales)
        await prisma.amigo.deleteMany({
            where: {
                OR: [
                    { userId: user.id },
                    { amigoId: user.id }
                ]
            }
        });
        console.log('✅ Relaciones de amistad eliminadas');

        // 7. Eliminar chat
        if (user.chat.length > 0) {
            await prisma.chat.deleteMany({
                where: { userId: user.id }
            });
            console.log('✅ Mensajes de chat eliminados');
        }

        // 8. Eliminar campeonatos
        if (user.campeonatos.length > 0) {
            await prisma.campeonato.deleteMany({
                where: { userId: user.id }
            });
            console.log('✅ Campeonatos eliminados');
        }

        // 9. Eliminar concursos
        if (user.concursos.length > 0) {
            await prisma.concurso.deleteMany({
                where: { userId: user.id }
            });
            console.log('✅ Concursos eliminados');
        }

        // 10. Eliminar noticias
        if (user.noticias.length > 0) {
            await prisma.noticia.deleteMany({
                where: { autorId: user.id }
            });
            console.log('✅ Noticias eliminadas');
        }

        // 11. Eliminar historias
        if (user.historias.length > 0) {
            await prisma.historia.deleteMany({
                where: { autorId: user.id }
            });
            console.log('✅ Historias eliminadas');
        }

        // 12. Finalmente eliminar el usuario
        await prisma.user.delete({
            where: { nick: 'PIPO68' }
        });
        console.log('✅ Usuario PIPO68 eliminado');

        console.log('\n🎉 ¡PIPO68 y todos sus datos han sido eliminados exitosamente!');
        console.log('Ahora puedes registrarte de nuevo desde cero.');

    } catch (error) {
        console.error('❌ Error eliminando PIPO68:', error);
    } finally {
        await prisma.$disconnect();
    }
}

deletePIPO68();