const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- 1. ENVIAR MENSAJE ---
router.post('/enviar', async (req, res) => {
    const { contenido, senderType, senderId, receiverId } = req.body;

    try {
        const nuevoMensaje = await prisma.mensaje.create({
            data: {
                contenido,
                senderType, 
                receiverId: parseInt(receiverId),
                // Si envía la empresa, guardamos su ID en senderEmpresaId
                senderEmpresaId: senderType === 'EMPRESA' ? parseInt(senderId) : null,
                // Si envía el usuario, guardamos su ID en senderUsuarioId
                senderUsuarioId: senderType === 'USUARIO' ? parseInt(senderId) : null,
                
                // NOTA: Para el historial, si el usuario envía, 
                // deberías saber a qué empresa va. 
                // Si tu esquema no tiene receiverEmpresaId, asegúrate de manejarlo.

                ...(senderType === 'EMPRESA' && {
                    notificacion: {
                        create: {
                            tipo: 'MENSAJE_NUEVO',
                            contenido: `La empresa te ha enviado un mensaje`,
                            usuarioId: parseInt(receiverId)
                        }
                    }
                })
            }
        });
        res.status(201).json(nuevoMensaje);
    } catch (error) {
        console.error("Error en POST /enviar:", error);
        res.status(500).json({ error: "Error al enviar mensaje" });
    }
});

// --- 2. OBTENER HISTORIAL (Corregido para ser específico) ---
router.get('/historial/:usuarioId/:empresaId', async (req, res) => {
    const uId = parseInt(req.params.usuarioId);
    const eId = parseInt(req.params.empresaId);

    try {
        const mensajes = await prisma.mensaje.findMany({
            where: {
                OR: [
                    // Mensajes enviados por la empresa al usuario
                    { senderEmpresaId: eId, receiverId: uId },
                    // Mensajes enviados por el usuario a esta empresa
                    // Ajustamos esto para que coincida con tu lógica de guardado
                    { senderUsuarioId: uId, senderType: 'USUARIO' } 
                ]
            },
            orderBy: { fechaEnvio: 'asc' }
        });
        res.json(mensajes);
    } catch (error) {
        console.error("Error en GET /historial:", error);
        res.status(500).json({ error: "Error al cargar historial" });
    }
});

// --- 3. CONTADORES ---
router.get('/contadores/:usuarioId', async (req, res) => {
    const userId = parseInt(req.params.usuarioId);
    try {
        const [mensajes, notificaciones] = await Promise.all([
            prisma.mensaje.count({ where: { receiverId: userId, read: false } }),
            prisma.notificacion.count({ where: { usuarioId: userId, vista: false } })
        ]);
        res.json({ unreadMessages: mensajes, unreadNotifications: notificaciones });
    } catch (error) {
        res.status(500).json({ error: "Error en contadores" });
    }
});

module.exports = router;