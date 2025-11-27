const fetch = require('node-fetch');

async function createTestUser() {
    try {
        const userData = {
            nombre: 'Usuario de Prueba',
            nick: 'TestUser',
            centro: 'Centro de Prueba',
            curso: '1º primaria',
            tipo: 'estudiante',
            email: 'test@example.com',
            password: 'password123'
        };

        console.log('Creando usuario de prueba...');

        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Usuario creado exitosamente:', data.user);
            console.log('Credenciales: nick="TestUser", password="password123"');
        } else {
            console.log('Error:', data.error);
        }
    } catch (error) {
        console.error('Error de conexión:', error.message);
    }
}

createTestUser();