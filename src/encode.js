// Contenido corregido para backend/src/encode.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Obtener el directorio actual (__dirname en CJS) usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Construir la ruta absoluta al archivo de credenciales
const filePath = path.resolve(__dirname, 'serviceAccountkey.json'); 
const variableName = 'FIREBASE_ADMIN_CREDENTIALS_BASE64';

try {
  // 3. Verificación y lectura
  if (!fs.existsSync(filePath)) {
    throw new Error(`El archivo de credenciales no se encontró en: ${filePath}`);
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Codifica el contenido a Base64
  const base64Encoded = Buffer.from(fileContent).toString('base64');

  console.log(`\n✅ ¡Éxito! Copia el siguiente valor para la variable ${variableName} en Railway:`);
  console.log('--------------------------------------------------------------------------------');
  console.log(base64Encoded);
  console.log('--------------------------------------------------------------------------------\n');
  
  console.log(`(Verificado: El archivo JSON fue leído correctamente desde ${filePath})`);
  
} catch (error) {
  console.error(`❌ Error al codificar: Asegúrate de que el archivo 'serviceAccountkey.json' esté en la carpeta 'src'.`);
  console.error(error.message);
}