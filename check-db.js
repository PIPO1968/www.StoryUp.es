const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
    const prisma = new PrismaClient();
    try {
        console.log('=== VERIFICANDO BASE DE DATOS ===\n');

        // Verificar usuarios
        const users = await prisma.user.findMany();
        console.log(`👥 Usuarios: ${users.length}`);
        if (users.length > 0) {
            users.forEach(u => console.log(`  - ${u.nick} (${u.email}) - Premium: ${u.premium}`));
        }

        // Verificar historias
        const historias = await prisma.historia.findMany();
        console.log(`📖 Historias: ${historias.length}`);

        // Verificar noticias
        const noticias = await prisma.noticia.findMany();
        console.log(`📰 Noticias: ${noticias.length}`);

        // Verificar amigos
        const amigos = await prisma.amigo.findMany();
        console.log(`🤝 Amigos: ${amigos.length}`);

        // Verificar concursos
        const concursos = await prisma.concurso.findMany();
        console.log(`🏆 Concursos: ${concursos.length}`);

        // Verificar torneos
        const torneos = await prisma.torneo.findMany();
        console.log(`🎯 Torneos: ${torneos.length}`);

        // Verificar preguntas
        const preguntas = await prisma.pregunta.findMany();
        console.log(`❓ Preguntas: ${preguntas.length}`);

        // Verificar trofeos
        const trofeos = await prisma.trofeo.findMany();
        console.log(`🏅 Trofeos: ${trofeos.length}`);

        console.log('\n=== FIN DE VERIFICACIÓN ===');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();