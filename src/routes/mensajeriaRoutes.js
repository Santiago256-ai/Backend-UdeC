import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// --- 1. ENVIAR MENSAJE ---
router.post('/enviar', async (req, res) => {
    const { contenido, senderType, senderId, receiverId } = req.body;

    // Validación básica para evitar errores de base de datos
    if (!contenido || !senderId || !receiverId) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const nuevoMensaje = await prisma.mensaje.create({
            data: {
                contenido,
                senderType, 
                receiverId: parseInt(receiverId),
                senderEmpresaId: senderType === 'EMPRESA' ? parseInt(senderId) : null,
                senderUsuarioId: senderType === 'USUARIO' ? parseInt(senderId) : null,
                // Si es empresa, crea la notificación en la misma transacción
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
        console.error("Error en DB:", error.message);
        res.status(500).json({ error: "No se pudo conectar con la base de datos" });
    }
});

// --- 2. OBTENER HISTORIAL (Filtrado privado corregido) ---
router.get('/historial/:usuarioId/:empresaId', async (req, res) => {
    const uId = parseInt(req.params.usuarioId);
    const eId = parseInt(req.params.empresaId);

    try {
        const mensajes = await prisma.mensaje.findMany({
            where: {
                OR: [
                    { senderEmpresaId: eId, receiverId: uId }, // Mensaje de Empresa a Usuario
                    { senderUsuarioId: uId, receiverId: eId }  // Mensaje de Usuario a Empresa (Corregido)
                ]
            },
            orderBy: { fechaEnvio: 'asc' }
        });
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ error: "Error al cargar historial de la base de datos" });
    }
});

export default router;