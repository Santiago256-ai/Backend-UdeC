// backend/src/config/firebase-admin.js

// 1. Usar sintaxis 'import' en lugar de 'require'
import admin from 'firebase-admin';

// 2. Importar el archivo JSON de credenciales de servicio de forma segura
// Nota: La ruta debe ser correcta. Si el archivo está en 'backend/', esta ruta lo alcanza:
// Después (compatible con Node.js 22+):
import serviceAccount from '../../service-account-key.json' with { type: "json" };


// Inicializa Firebase Admin solo si no ha sido inicializado ya
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

// 3. Usar sintaxis 'export default' en lugar de 'module.exports'
export default admin;