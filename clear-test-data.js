const { PrismaClient } = require('@prisma/client');

async function clearTestData() {
    const prisma = new PrismaClient();

    try {
        console.log('🧹 Eliminando datos de prueba...\n');

        // 1. Eliminar historias de usuarios de prueba
        console.log('📖 Eliminando historias de prueba...');
        const historiasEliminadas = await prisma.historia.deleteMany({
            where: {
                autor: {
                    nick: {
                        in: ['TestDocente', 'TestEstudiante']
                    }
                }
            }
        });
        console.log(`✅ ${historiasEliminadas.count} historias de prueba eliminadas`);

        // 2. Eliminar noticias de usuarios de prueba (si las hay)
        console.log('📰 Eliminando noticias de prueba...');
        const noticiasEliminadas = await prisma.noticia.deleteMany({
            where: {
                autor: {
                    nick: {
                        in: ['TestDocente', 'TestEstudiante']
                    }
                }
            }
        });
        console.log(`✅ ${noticiasEliminadas.count} noticias de prueba eliminadas`);

        // 3. Eliminar usuarios de prueba
        console.log('👥 Eliminando usuarios de prueba...');
        const usuariosEliminados = await prisma.user.deleteMany({
            where: {
                nick: {
                    in: ['TestDocente', 'TestEstudiante']
                }
            }
        });
        console.log(`✅ ${usuariosEliminados.count} usuarios de prueba eliminados`);

        console.log('\n🎉 ¡Datos de prueba eliminados exitosamente!');

    } catch (error) {
        console.error('❌ Error eliminando datos de prueba:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearTestData();