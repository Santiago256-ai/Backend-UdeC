// Normalización del nombre de usuario de los administradores. La comparten el
// login (POST /api/auth/admin/login) y scripts/admin.mjs, para que la cuenta se
// guarde y se busque siempre igual. Devuelve null si no es un texto.
export const normalizarUsuario = (usuario) =>
    typeof usuario === "string" ? usuario.trim().toLowerCase() : null;
