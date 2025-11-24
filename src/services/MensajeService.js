// src/services/MensajeService.js

// Este servicio usa el pool de PostgreSQL y transacciones para garantizar atomicidad.

async function enviarMensajeEmpresa(pool, empresaId, postulanteId, contenido) {
    // Usamos una transacción para asegurar que el mensaje y la notificación se creen juntos
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // Iniciar la transacción

        // 1. Guardar el mensaje en la tabla 'Mensaje'
        // NOTA: Ajusta los nombres de las columnas (sender_empresa_id, receiver_id, contenido, sender_type, read) 
        // para que coincidan con tu esquema PostgreSQL real.
        const mensajeQuery = `
            INSERT INTO Mensaje (sender_empresa_id, receiver_id, contenido, sender_type, read, fecha_envio)
            VALUES ($1, $2, $3, 'EMPRESA', FALSE, NOW())
            RETURNING *;
        `;
        const mensajeResult = await client.query(mensajeQuery, [empresaId, postulanteId, contenido]);
        const nuevoMensaje = mensajeResult.rows[0];
        
        // 2. Crear una notificación para el postulante
        // NOTA: Ajusta los nombres de las columnas (usuario_id, tipo, contenido, mensaje_id, vista)
        const notificacionQuery = `
            INSERT INTO Notificacion (usuario_id, tipo, contenido, mensaje_id, vista, fecha)
            VALUES ($1, 'MENSAJE_NUEVO', $2, $3, FALSE, NOW())
            RETURNING *;
        `;
        const nuevaNotificacionResult = await client.query(notificacionQuery, [
            postulanteId, 
            `Tienes un nuevo mensaje de una empresa.`,
            nuevoMensaje.id
        ]);
        const nuevaNotificacion = nuevaNotificacionResult.rows[0];

        await client.query('COMMIT'); // Confirmar la transacción
        
        return { mensaje: nuevoMensaje, notificacion: nuevaNotificacion };

    } catch (error) {
        await client.query('ROLLBACK'); // Revertir si hay un error
        throw error;
    } finally {
        client.release();
    }
}

export default {
    enviarMensajeEmpresa
};