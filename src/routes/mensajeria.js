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
                senderType, // 'EMPRESA' o 'USUARIO'
                // Si el que recibe es un Estudiante, usamos receiverId
                // Si el que recibe es una Empresa, usamos una lógica interna (ver nota abajo)
                receiverId: parseInt(receiverId), 
                
                senderEmpresaId: senderType === 'EMPRESA' ? parseInt(senderId) : null,
                senderUsuarioId: senderType === 'USUARIO' ? parseInt(senderId) : null,
                
                // Solo creamos notificación si el receptor es un USUARIO (Estudiante)
                // Tu esquema actual solo permite notificaciones para Usuario
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
        console.error(error);
        res.status(500).json({ error: "Error al enviar mensaje" });
    }
});

// --- 2. OBTENER HISTORIAL (Bidireccional) ---
router.get('/historial/:usuarioId/:empresaId', async (req, res) => {
    const uId = parseInt(req.params.usuarioId);
    const eId = parseInt(req.params.empresaId);

    try {
        const mensajes = await prisma.mensaje.findMany({
            where: {
                OR: [
                    // Caso A: Empresa escribe a Usuario
                    { senderEmpresaId: eId, receiverId: uId },
                    // Caso B: Usuario escribe a Empresa
                    { senderUsuarioId: uId, senderEmpresaId: null } 
                    // Nota: En el caso B, como no tienes 'receiverEmpresaId', 
                    // asumimos que si el usuario escribe en este chat, es para esta empresa.
                ]
            },
            orderBy: { fechaEnvio: 'asc' }
        });
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ error: "Error al cargar historial" });
    }
});

// --- 3. CONTADORES PARA NAVBAR ---
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