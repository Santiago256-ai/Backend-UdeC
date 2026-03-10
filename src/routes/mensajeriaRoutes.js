import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
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
                senderEmpresaId: senderType === 'EMPRESA' ? parseInt(senderId) : null,
                senderUsuarioId: senderType === 'USUARIO' ? parseInt(senderId) : null,
                
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

// --- 2. OBTENER HISTORIAL ---
router.get('/historial/:usuarioId/:empresaId', async (req, res) => {
    const uId = parseInt(req.params.usuarioId);
    const eId = parseInt(req.params.empresaId);

    try {
        const mensajes = await prisma.mensaje.findMany({
            where: {
                OR: [
                    { senderEmpresaId: eId, receiverId: uId },
                    { senderUsuarioId: uId, senderType: 'USUARIO' } 
                ]
            },
            orderBy: { fechaEnvio: 'asc' }
        });
        res.json(mensajes);
    } catch (error) {
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

export default router; // IMPORTANTE: Usar export default para ES Modules