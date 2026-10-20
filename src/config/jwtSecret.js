// Único lugar del backend que lee JWT_SECRET. Todo lo que firma o verifica
// tokens importa JWT_SECRET de aquí: no hay claves por defecto escritas en el
// código ni comprobaciones distintas en cada archivo.
//
// Se lee una sola vez, al cargar el módulo. src/server.js importa "dotenv/config"
// antes que cualquier ruta, así que en local el valor del .env ya está cargado
// (ojo: importar @prisma/client también carga el .env por su cuenta). En Vercel
// el .env no se sube (está en .gitignore): llega por las variables del proyecto.
//
// Si falta, el servidor no arranca (en Vercel, todas las peticiones responden 500
// y este mensaje queda en los registros de la función). Nunca se imprime el valor.

const valor = process.env.JWT_SECRET;

if (typeof valor !== "string" || valor.trim() === "") {
    const mensaje =
        "Falta la variable de entorno JWT_SECRET (no está definida o está vacía). " +
        "El servidor no arranca sin ella: ninguna clave por defecto la reemplaza. " +
        "Defínela en el entorno (en Vercel: Settings → Environment Variables) y vuelve a desplegar.";
    console.error(`❌ ${mensaje}`);
    throw new Error(mensaje);
}

if (valor.length < 32) {
    console.warn(
        "⚠️ JWT_SECRET es más corta de lo recomendado (32 caracteres o más). " +
        "El servidor arranca igual, pero conviene rotarla por una más larga."
    );
}

export const JWT_SECRET = valor;
