const { PrismaClient } = require('@prisma/client');

async function testDB() {
    const prisma = new PrismaClient();
    try {
        const users = await prisma.user.findMany();
        console.log('DB connected, users:', users.length);
        users.forEach(user => {
            console.log('User:', { id: user.id, nick: user.nick, passwordStart: user.password ? user.password.substring(0, 10) : 'no password' });
        });
    } catch (err) {
        console.error('DB error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

testDB();