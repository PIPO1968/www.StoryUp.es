// Script para limpiar completamente todos los datos de PIPO68
console.log('🧹 Limpiando todos los datos de PIPO68...\n');

// Función para limpiar localStorage
function clearLocalStorage() {
    console.log('📱 Limpiando localStorage...');
    const keys = Object.keys(localStorage);
    const pipoKeys = keys.filter(key =>
        key.includes('PIPO68') ||
        key.includes('pipo68') ||
        key.toLowerCase().includes('pipo')
    );

    console.log(`  - Encontradas ${pipoKeys.length} claves relacionadas`);
    pipoKeys.forEach(key => {
        console.log(`    Eliminando: ${key}`);
        localStorage.removeItem(key);
    });
}

// Función para limpiar sessionStorage
function clearSessionStorage() {
    console.log('💾 Limpiando sessionStorage...');
    const keys = Object.keys(sessionStorage);
    const pipoKeys = keys.filter(key =>
        key.includes('PIPO68') ||
        key.includes('pipo68') ||
        key.toLowerCase().includes('pipo')
    );

    console.log(`  - Encontradas ${pipoKeys.length} claves relacionadas`);
    pipoKeys.forEach(key => {
        console.log(`    Eliminando: ${key}`);
        sessionStorage.removeItem(key);
    });
}

// Función para limpiar cookies
function clearCookies() {
    console.log('🍪 Limpiando cookies...');
    const cookies = document.cookie.split(';');
    const pipoCookies = cookies.filter(cookie =>
        cookie.includes('PIPO68') ||
        cookie.includes('pipo68') ||
        cookie.toLowerCase().includes('pipo')
    );

    console.log(`  - Encontradas ${pipoCookies.length} cookies relacionadas`);
    pipoCookies.forEach(cookie => {
        const cookieName = cookie.split('=')[0].trim();
        console.log(`    Eliminando: ${cookieName}`);
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
}

// Función para limpiar datos generales de usuario
function clearGeneralUserData() {
    console.log('👤 Limpiando datos generales de usuario...');

    // Limpiar datos de usuario
    const userKeys = ['user', 'usuario', 'currentUser', 'loggedUser'];
    userKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            console.log(`    Eliminando: ${key}`);
            localStorage.removeItem(key);
        }
    });

    // Limpiar datos de premium
    const premiumKeys = Object.keys(localStorage).filter(key => key.includes('premium'));
    premiumKeys.forEach(key => {
        console.log(`    Eliminando: ${key}`);
        localStorage.removeItem(key);
    });
}

// Ejecutar limpieza
clearLocalStorage();
clearSessionStorage();
clearCookies();
clearGeneralUserData();

console.log('\n✅ ¡Limpieza completa! Ahora puedes registrarte como PIPO68 desde cero.');
console.log('Asegúrate de:');
console.log('1. Cerrar sesión completamente');
console.log('2. Limpiar cache del navegador (Ctrl+Shift+R)');
console.log('3. Registrarte de nuevo como PIPO68');