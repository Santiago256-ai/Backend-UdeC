// backend/services/MensajeService.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function enviarMensajeEmpresa(empresaId, postulanteId, contenido) {
    // Usamos una transacción para asegurar que el mensaje y la notificación se creen juntos
    return prisma.$transaction(async (tx) => {
        
        // 1. Guardar el mensaje en la tabla 'Mensaje'
        const nuevoMensaje = await tx.mensaje.create({
            data: {
                // Aquí usamos IDs genéricos, ajusta los nombres de las columnas si son diferentes
                senderId: empresaId,       
                receiverId: postulanteId,
                contenido: contenido,
                senderType: 'EMPRESA', // Indicamos quién envía
                read: false, 
                // La fecha de creación la maneja Prisma por defecto (createdAt)
            }
        });
        
        // 2. Crear una notificación para el postulante (el receptor)
        const nuevaNotificacion = await tx.notificacion.create({
            data: {
                usuarioId: postulanteId, // El ID del estudiante a notificar
                tipo: 'MENSAJE_NUEVO',
                contenido: `Tienes un nuevo mensaje de una empresa.`,
                referenciaId: nuevoMensaje.id, // Enlaza la notificación al mensaje
                vista: false, 
            }
        });

        return { mensaje: nuevoMensaje, notificacion: nuevaNotificacion };
    });
}

module.exports = {
    enviarMensajeEmpresa
};