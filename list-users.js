const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
    const prisma = new PrismaClient();
    try {
        const users = await prisma.user.findMany();
        console.log('Total usuarios:', users.length);
        users.forEach(u => console.log(`ID: ${u.id}, Nick: ${u.nick}, Premium: ${u.premium}, Email: ${u.email}`));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();