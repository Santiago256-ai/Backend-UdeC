// backend/src/config/firebase-admin.js

import admin from 'firebase-admin';

// 1. Obtener las credenciales desde la variable de entorno
const serviceAccountKey = process.env.FIREBASE_ADMIN_CREDENTIALS;

let credentials;

try {
    if (!serviceAccountKey) {
        throw new Error("FIREBASE_ADMIN_CREDENTIALS environment variable is not set.");
    }
    // 2. Parsear el string JSON a un objeto (esto es necesario en producción)
    credentials = JSON.parse(serviceAccountKey); 
} catch (error) {
    console.error("Error parsing Firebase credentials:", error.message);
    // Si falla, el servicio no iniciará, lo cual es correcto por seguridad.
    process.exit(1); 
}

// Inicializa Firebase Admin solo si no ha sido inicializado ya
if (!admin.apps.length) {
    admin.initializeApp({
        // Usar el objeto parseado para inicializar
        credential: admin.credential.cert(credentials) 
    });
}

export default admin;