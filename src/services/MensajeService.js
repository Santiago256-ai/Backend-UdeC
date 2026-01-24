// Cambié el nombre para que coincida con tu export
async function enviarMensajeEmpresa(pool, { senderId, receiverId, contenido, senderType }) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const senderEmpresaId = senderType === 'EMPRESA' ? parseInt(senderId) : null;
        const senderUsuarioId = senderType === 'USUARIO' ? parseInt(senderId) : null;

        const mensajeQuery = `
            INSERT INTO "Mensaje" 
            ("senderEmpresaId", "senderUsuarioId", "receiverId", "contenido", "senderType", "read", "fechaEnvio")
            VALUES ($1, $2, $3, $4, $5, FALSE, NOW())
            RETURNING *;
        `;

        const mensajeResult = await client.query(mensajeQuery, [
            senderEmpresaId,
            senderUsuarioId,
            parseInt(receiverId),
            contenido,
            senderType
        ]);

        await client.query('COMMIT');
        return mensajeResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function obtenerHistorial(pool, usuarioId, empresaId) {
    const query = `
        SELECT * FROM "Mensaje"
        WHERE ("senderEmpresaId" = $2 AND "receiverId" = $1) -- Mensajes de Empresa a Usuario
           OR ("senderUsuarioId" = $1 AND "receiverId" = $2) -- Mensajes de Usuario a Empresa (CORREGIDO)
        ORDER BY "fechaEnvio" ASC;
    `;
    const result = await pool.query(query, [parseInt(usuarioId), parseInt(empresaId)]);
    return result.rows;
}

export default { enviarMensajeEmpresa, obtenerHistorial };