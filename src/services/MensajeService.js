// src/services/MensajeService.js

async function enviarMensajeEmpresa(pool, empresaId, postulanteId, contenido) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insertar mensaje (usamos el nombre REAL de la tabla: "Mensaje")
        const mensajeQuery = `
            INSERT INTO "Mensaje" 
            (senderEmpresaId, receiverId, contenido, senderType, read, fechaEnvio)
            VALUES ($1, $2, $3, 'EMPRESA', FALSE, NOW())
            RETURNING *;
        `;

        const mensajeResult = await client.query(mensajeQuery, [
            empresaId,
            postulanteId,
            contenido
        ]);

        const nuevoMensaje = mensajeResult.rows[0];

        // 2. Insertar notificación (la tabla real también usa mayúsculas: "Notificacion")
        const notificacionQuery = `
            INSERT INTO "Notificacion" 
            (usuarioId, tipo, contenido, mensajeId, vista, fecha)
            VALUES ($1, 'MENSAJE_NUEVO', $2, $3, FALSE, NOW())
            RETURNING *;
        `;

        const notificacionResult = await client.query(notificacionQuery, [
            postulanteId,
            `Tienes un nuevo mensaje de una empresa.`,
            nuevoMensaje.id
        ]);

        const nuevaNotificacion = notificacionResult.rows[0];

        await client.query('COMMIT');

        return {
            mensaje: nuevoMensaje,
            notificacion: nuevaNotificacion
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export default {
    enviarMensajeEmpresa
};
