import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// --- 1. ENVIAR MENSAJE ---
router.post('/enviar', async (req, res) => {
    const { contenido, senderType, senderEmpresaId, receiverId, vacanteId } = req.body;

    if (!contenido || !receiverId || !vacanteId) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const nuevoMensaje = await prisma.mensaje.create({
            data: {
                contenido,
                senderType, 
                // receiverId siempre es el Egresado en tu esquema de DB
                receiverId: parseInt(receiverId),
                vacanteId: parseInt(vacanteId),
                // Si envía la empresa:
                senderEmpresaId: senderType === 'EMPRESA' ? parseInt(senderEmpresaId) : null,
                // Si enviara el egresado (para tu referencia futura):
                senderEgresadoId: senderType === 'USUARIO' ? parseInt(req.body.senderEgresadoId) : null,
                
                ...(senderType === 'EMPRESA' && {
                    notificacion: {
                        create: {
                            tipo: 'MENSAJE_NUEVO',
                            contenido: `La empresa te ha enviado un mensaje`,
                            egresadoId: parseInt(receiverId) // Cambiado: de usuarioId a egresadoId
                        }
                    }
                })
            }
        });
        res.status(201).json(nuevoMensaje);
    } catch (error) {
        console.error("Error en DB:", error.message);
        res.status(500).json({ error: "No se pudo enviar el mensaje: " + error.message });
    }
});

// --- 2. OBTENER HISTORIAL ---
router.get('/historial/:egresadoId/:empresaId/:vacanteId', async (req, res) => {
    const eId = parseInt(req.params.egresadoId);
    const empId = parseInt(req.params.empresaId);
    const vId = parseInt(req.params.vacanteId);

    try {
        // 1. Buscamos la postulación (Cambiado: de usuarioId a egresadoId)
        const postulacion = await prisma.postulacion.findFirst({
            where: { 
                egresadoId: eId, 
                vacanteId: vId 
            }
        });

        // 2. Buscamos los mensajes (Cambiado: nombres de campos según tu schema.prisma)
        const mensajes = await prisma.mensaje.findMany({
            where: {
                vacanteId: vId,
                OR: [
                    { senderEmpresaId: empId, receiverId: eId },
                    { senderEgresadoId: eId, receiverId: empId } // Nota: tu schema actual solo permite receiver Egresado, ajusta esto si la empresa también recibe.
                ]
            },
            orderBy: { fechaEnvio: 'asc' }
        });
        
        res.json({
            mensajes: mensajes,
            chatActivo: postulacion ? postulacion.chatActivo : true 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al cargar historial" });
    }
});

// --- 3. ACTUALIZAR ESTADO DE ACTIVIDAD DEL CHAT ---
router.patch('/status-chat', async (req, res) => {
    const { usuarioId, vacanteId, activo } = req.body;

    try {
        await prisma.postulacion.updateMany({
            where: {
                egresadoId: parseInt(usuarioId), // Cambiado: de usuarioId a egresadoId
                vacanteId: parseInt(vacanteId)
            },
            data: { 
                chatActivo: activo 
            }
        });
        
        res.json({ success: true, message: "Estado actualizado" });
    } catch (error) {
        res.status(500).json({ error: "No se pudo actualizar en la DB" });
    }
});

export default router;