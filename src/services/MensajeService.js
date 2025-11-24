// src/services/MensajeService.js

// Este servicio usa el pool de PostgreSQL y transacciones para garantizar atomicidad.

async function enviarMensajeEmpresa(pool, empresaId, postulanteId, contenido) {
    // Usamos una transacción para asegurar que el mensaje y la notificación se creen juntos
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // Iniciar la transacción

        // 1. Guardar el mensaje en la tabla 'mensaje'
        // IMPORTANTE: Se ha cambiado 'Mensaje' a 'mensaje' (minúsculas) para cumplir
        // con la convención de PostgreSQL y evitar errores de sensibilidad a mayúsculas/minúsculas.
        const mensajeQuery = `
            INSERT INTO mensaje (sender_empresa_id, receiver_id, contenido, sender_type, read, fecha_envio)
            VALUES ($1, $2, $3, 'EMPRESA', FALSE, NOW())
            RETURNING *;
        `;
        const mensajeResult = await client.query(mensajeQuery, [empresaId, postulanteId, contenido]);
        const nuevoMensaje = mensajeResult.rows[0];
        
        // 2. Crear una notificación para el postulante
        // IMPORTANTE: También se ha cambiado 'Notificacion' a 'notificacion' por la misma razón.
        const notificacionQuery = `
            INSERT INTO notificacion (usuario_id, tipo, contenido, mensaje_id, vista, fecha)
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
        // La pila de llamadas indica que el error se capturó aquí y se propagó.
        // El error específico era "relation "mensaje" does not exist".
        await client.query('ROLLBACK'); // Revertir si hay un error
        throw error;
    } finally {
        client.release();
    }
}

export default {
    enviarMensajeEmpresa
};