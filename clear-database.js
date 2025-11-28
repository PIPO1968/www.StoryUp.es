const { PrismaClient } = require('@prisma/client');

async function clearDatabase() {
    const prisma = new PrismaClient();

    try {
        console.log('🗑️  LIMPIANDO COMPLETAMENTE LA BASE DE DATOS...\n');

        // 1. Eliminar sesiones de usuario
        console.log('🕒 Eliminando sesiones de usuario...');
        const sesionesCount = await prisma.sesionUsuario.count();
        if (sesionesCount > 0) {
            await prisma.sesionUsuario.deleteMany();
            console.log(`✅ Eliminadas ${sesionesCount} sesiones`);
        }

        // 2. Eliminar solicitudes premium
        console.log('💳 Eliminando solicitudes premium...');
        const solicitudesCount = await prisma.solicitudPremium.count();
        if (solicitudesCount > 0) {
            await prisma.solicitudPremium.deleteMany();
            console.log(`✅ Eliminadas ${solicitudesCount} solicitudes premium`);
        }

        // 3. Eliminar premios mensuales
        console.log('🏆 Eliminando premios mensuales...');
        const premiosCount = await prisma.premioMensual.count();
        if (premiosCount > 0) {
            await prisma.premioMensual.deleteMany();
            console.log(`✅ Eliminados ${premiosCount} premios mensuales`);
        }

        // 4. Eliminar estadísticas de usuario
        console.log('📊 Eliminando estadísticas de usuario...');
        const statsCount = await prisma.userStats.count();
        if (statsCount > 0) {
            await prisma.userStats.deleteMany();
            console.log(`✅ Eliminadas ${statsCount} estadísticas de usuario`);
        }

        // 5. Eliminar torneos (primero quitar referencias)
        console.log('🎯 Eliminando torneos...');
        const torneosCount = await prisma.torneo.count();
        if (torneosCount > 0) {
            // Primero quitar referencias de ganadores
            await prisma.torneo.updateMany({
                data: { ganadorId: null }
            });
            await prisma.torneo.deleteMany();
            console.log(`✅ Eliminados ${torneosCount} torneos`);
        }

        // 6. Eliminar campeonatos
        console.log('🏅 Eliminando campeonatos...');
        const campeonatosCount = await prisma.campeonato.count();
        if (campeonatosCount > 0) {
            await prisma.campeonato.deleteMany();
            console.log(`✅ Eliminados ${campeonatosCount} campeonatos`);
        }

        // 7. Eliminar concursos
        console.log('🎪 Eliminando concursos...');
        const concursosCount = await prisma.concurso.count();
        if (concursosCount > 0) {
            await prisma.concurso.deleteMany();
            console.log(`✅ Eliminados ${concursosCount} concursos`);
        }

        // 8. Eliminar mensajes de chat
        console.log('💬 Eliminando mensajes de chat...');
        const chatCount = await prisma.chat.count();
        if (chatCount > 0) {
            await prisma.chat.deleteMany();
            console.log(`✅ Eliminados ${chatCount} mensajes de chat`);
        }

        // 9. Eliminar amistades (relaciones bidireccionales)
        console.log('🤝 Eliminando amistades...');
        const amistadesCount = await prisma.amigo.count();
        if (amistadesCount > 0) {
            await prisma.amigo.deleteMany();
            console.log(`✅ Eliminadas ${amistadesCount} amistades`);
        }

        // 10. Eliminar noticias
        console.log('📰 Eliminando noticias...');
        const noticiasCount = await prisma.noticia.count();
        if (noticiasCount > 0) {
            await prisma.noticia.deleteMany();
            console.log(`✅ Eliminadas ${noticiasCount} noticias`);
        }

        // 11. Eliminar historias
        console.log('📖 Eliminando historias...');
        const historiasCount = await prisma.historia.count();
        if (historiasCount > 0) {
            await prisma.historia.deleteMany();
            console.log(`✅ Eliminadas ${historiasCount} historias`);
        }

        // 12. Eliminar usuarios
        console.log('👥 Eliminando usuarios...');
        const usuariosCount = await prisma.user.count();
        if (usuariosCount > 0) {
            await prisma.user.deleteMany();
            console.log(`✅ Eliminados ${usuariosCount} usuarios`);
        }

        // NOTA: Mantengo las preguntas y trofeos porque son datos estáticos necesarios para el funcionamiento

        console.log('\n🎉 ¡BASE DE DATOS COMPLETAMENTE LIMPIA!');
        console.log('✅ Mantengo: Preguntas y Trofeos (datos estáticos necesarios)');
        console.log('✅ Eliminado: Todo lo demás (usuarios, historias, amistades, etc.)');

        // Verificación final
        console.log('\n📊 VERIFICACIÓN FINAL:');
        const finalUsers = await prisma.user.count();
        const finalHistorias = await prisma.historia.count();
        const finalPreguntas = await prisma.pregunta.count();
        const finalTrofeos = await prisma.trofeo.count();

        console.log(`👥 Usuarios: ${finalUsers}`);
        console.log(`📖 Historias: ${finalHistorias}`);
        console.log(`❓ Preguntas: ${finalPreguntas} (mantenidas)`);
        console.log(`🏅 Trofeos: ${finalTrofeos} (mantenidos)`);

    } catch (error) {
        console.error('❌ Error limpiando la base de datos:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearDatabase();