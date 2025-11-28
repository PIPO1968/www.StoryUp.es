const { PrismaClient } = require('@prisma/client');

async function checkPIPO68() {
    const prisma = new PrismaClient();

    try {
        console.log('🔍 Verificando si PIPO68 existe en la base de datos...\n');

        // Buscar usuario PIPO68
        const user = await prisma.user.findUnique({
            where: { nick: 'PIPO68' }
        });

        if (user) {
            console.log('❌ ¡PIPO68 AÚN EXISTE!');
            console.log('Datos del usuario:');
            console.log(`  - ID: ${user.id}`);
            console.log(`  - Nick: ${user.nick}`);
            console.log(`  - Email: ${user.email}`);
            console.log(`  - Premium: ${user.premium}`);
            console.log(`  - Fecha registro: ${user.fechaInscripcion}`);
            console.log(`  - Centro: ${user.centro}`);
            console.log(`  - Tipo: ${user.tipo}`);

            // Verificar si hay datos relacionados
            const historias = await prisma.historia.findMany({
                where: { autorId: user.id }
            });
            console.log(`  - Historias: ${historias.length}`);

            const amigos = await prisma.amigo.findMany({
                where: {
                    OR: [
                        { userId: user.id },
                        { amigoId: user.id }
                    ]
                }
            });
            console.log(`  - Relaciones de amistad: ${amigos.length}`);

        } else {
            console.log('✅ PIPO68 no existe en la base de datos');
        }

        // Verificar total de usuarios
        const totalUsers = await prisma.user.count();
        console.log(`\n📊 Total de usuarios en BD: ${totalUsers}`);

    } catch (error) {
        console.error('❌ Error verificando PIPO68:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkPIPO68();