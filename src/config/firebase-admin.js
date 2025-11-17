import admin from 'firebase-admin';
import { Buffer } from 'buffer'; // Importamos Buffer para decodificar

// La variable que sí funciona en Railway
const base64Credentials = process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64; 

let credentials;

try {
    // ⚠️ CRÍTICO: Asegurarse de que no esté leyendo la variable antigua por defecto
    if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
        delete process.env.FIREBASE_ADMIN_CREDENTIALS;
    }

    if (!base64Credentials) {
        throw new Error("ERROR CRÍTICO: La variable FIREBASE_ADMIN_CREDENTIALS_BASE64 no está configurada.");
    }

    // 1. Decodificar la cadena Base64
    const decodedJson = Buffer.from(base64Credentials, 'base64').toString('utf8');
    
    // 2. Parsear el string JSON
    credentials = JSON.parse(decodedJson); 
} catch (error) {
    console.error("❌ Error al procesar credenciales Base64 de Firebase:", error.message);
    // Forzar el cierre para que Railway registre el error.
    process.exit(1); 
}

// Inicializa Firebase Admin solo si no ha sido inicializado ya
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(credentials) 
    });
}

console.log("✅ Firebase Admin SDK configurado (usando Base64)");

export default admin;