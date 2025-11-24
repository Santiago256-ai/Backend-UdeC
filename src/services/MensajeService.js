// backend/services/MensajeService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function enviarMensajeEmpresa(empresaId, postulanteId, contenido) {
    // Usamos una transacción para garantizar que ambos registros (Mensaje y Notificación) 
    // se creen o fallen juntos.
    return prisma.$transaction(async (tx) => {
        
        // 1. Crear el registro del Mensaje
        const nuevoMensaje = await tx.mensaje.create({
            data: {
                // Relación con el emisor (Empresa)
                senderEmpresaId: empresaId,       
                senderType: 'EMPRESA', // Tipo de emisor
                
                // Relación con el receptor (Postulante/Usuario)
                receiverId: postulanteId,
                
                // Contenido
                contenido: contenido,
                read: false, 
            }
        });
        
        // 2. Crear una Notificación para el postulante
        const nuevaNotificacion = await tx.notificacion.create({
            data: {
                usuarioId: postulanteId, // El ID del usuario que debe recibir la alerta
                tipo: 'MENSAJE_NUEVO',
                contenido: `Has recibido un nuevo mensaje de una empresa.`,
                
                // Enlaza la notificación al mensaje recién creado
                mensajeId: nuevoMensaje.id, 
                vista: false, 
            }
        });

        // Devuelve los registros creados
        return { mensaje: nuevoMensaje, notificacion: nuevaNotificacion };
    });
}

module.exports = {
    enviarMensajeEmpresa
};