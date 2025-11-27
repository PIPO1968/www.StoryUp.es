const { Client } = require('pg');

const client = new Client({
    host: 'shinkansen.proxy.rlwy.net',
    port: 20940,
    user: 'postgres',
    password: 'WFpwQvsIvlFMBIFkzxdJLPVFxwUxMSVl',
    database: 'railway',
    ssl: { rejectUnauthorized: false }
}); async function dropTables() {
    try {
        await client.connect();
        console.log('Conectado a la DB');

        const tables = [
            'users', 'pregunta', 'trofeo', 'amigos', 'chat', 'campeonatos',
            'concursos', 'configuracion', 'historias', 'noticias', 'palabras_prohibidas',
            'premios_mensuales', 'sesiones_usuario', 'solicitudes_premium'
        ];

        for (const table of tables) {
            await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
            console.log(`Tabla ${table} eliminada`);
        }

        console.log('Todas las tablas eliminadas');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

dropTables();