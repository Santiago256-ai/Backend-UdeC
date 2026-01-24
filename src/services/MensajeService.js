async function enviarMensaje(pool, { senderId, receiverId, contenido, senderType }) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Determinamos quién es el remitente real para la DB
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

// ⚡ NUEVA FUNCIÓN: Para que el historial cargue en el frontend
async function obtenerHistorial(pool, usuarioId, empresaId) {
    const query = `
        SELECT * FROM "Mensaje"
        WHERE ("senderEmpresaId" = $2 AND "receiverId" = $1)
           OR ("senderUsuarioId" = $1 AND "senderType" = 'USUARIO')
        ORDER BY "fechaEnvio" ASC;
    `;
    const result = await pool.query(query, [usuarioId, empresaId]);
    return result.rows;
}

export default { enviarMensajeEmpresa, obtenerHistorial };