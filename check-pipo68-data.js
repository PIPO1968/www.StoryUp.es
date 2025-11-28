// Script para verificar datos persistentes de PIPO68
console.log('🔍 Verificando datos persistentes de PIPO68...\n');

// Verificar localStorage
console.log('📱 LocalStorage:');
const keys = Object.keys(localStorage);
const pipoKeys = keys.filter(key => key.includes('PIPO68') || key.includes('pipo68'));
console.log(`  - Claves relacionadas con PIPO68: ${pipoKeys.length}`);
pipoKeys.forEach(key => {
    try {
        const value = localStorage.getItem(key);
        console.log(`    ${key}: ${value?.substring(0, 100)}${value && value.length > 100 ? '...' : ''}`);
    } catch (e) {
        console.log(`    ${key}: [Error al leer]`);
    }
});

// Verificar si hay datos de premium
const premiumData = localStorage.getItem('premium_PIPO68');
if (premiumData) {
    console.log('\n👑 Datos de premium encontrados:');
    try {
        const data = JSON.parse(premiumData);
        console.log(`  - Activo: ${data.activo}`);
        console.log(`  - Inicio: ${data.inicio}`);
        console.log(`  - Expiración: ${data.expiracion}`);
    } catch (e) {
        console.log(`  - Error parseando: ${premiumData}`);
    }
} else {
    console.log('\n❌ No hay datos de premium en localStorage');
}

// Verificar cookies
console.log('\n🍪 Cookies:');
const cookies = document.cookie.split(';');
const pipoCookies = cookies.filter(cookie => cookie.includes('PIPO68') || cookie.includes('pipo68'));
console.log(`  - Cookies relacionadas: ${pipoCookies.length}`);
pipoCookies.forEach(cookie => {
    console.log(`    ${cookie.trim()}`);
});

// Verificar sessionStorage
console.log('\n💾 SessionStorage:');
const sessionKeys = Object.keys(sessionStorage);
const sessionPipoKeys = sessionKeys.filter(key => key.includes('PIPO68') || key.includes('pipo68'));
console.log(`  - Claves relacionadas: ${sessionPipoKeys.length}`);
sessionPipoKeys.forEach(key => {
    console.log(`    ${key}: ${sessionStorage.getItem(key)}`);
});

console.log('\n✅ Verificación completa');