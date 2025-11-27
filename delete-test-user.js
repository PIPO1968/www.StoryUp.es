const { PrismaClient } = require('@prisma/client');

async function deleteTestUser() {
    const prisma = new PrismaClient();
    try {
        await prisma.user.delete({
            where: { nick: 'TestUser' }
        });
        console.log('Usuario de prueba eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteTestUser();