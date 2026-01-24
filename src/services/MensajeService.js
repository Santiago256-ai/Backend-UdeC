// src/services/MensajeService.js

async function enviarMensajeEmpresa(pool, empresaId, postulanteId, contenido) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const mensajeQuery = `
            INSERT INTO "Mensaje" 
            ("senderEmpresaId", "receiverId", "contenido", "senderType", "read", "fechaEnvio")
            VALUES ($1, $2, $3, 'EMPRESA', FALSE, NOW())
            RETURNING *;
        `;

        const mensajeResult = await client.query(mensajeQuery, [
            empresaId,
            postulanteId,
            contenido
        ]);

        const nuevoMensaje = mensajeResult.rows[0];

        const notificacionQuery = `
            INSERT INTO "Notificacion" 
            ("usuarioId", "tipo", "contenido", "mensajeId", "vista", "fecha")
            VALUES ($1, 'MENSAJE_NUEVO', $2, $3, FALSE, NOW())
            RETURNING *;
        `;

        const notifResult = await client.query(notificacionQuery, [
            postulanteId,
            `Tienes un nuevo mensaje de una empresa.`,
            nuevoMensaje.id
        ]);

        await client.query('COMMIT');
        return { mensaje: nuevoMensaje, notificacion: notifResult.rows[0] };

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