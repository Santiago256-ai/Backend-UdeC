import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * 1. ENVIAR MENSAJE
 * Sincronizado con los modelos Egresado y Empresa.
 */
router.post('/enviar', async (req, res) => {
    const { contenido, senderType, senderEmpresaId, senderEgresadoId, receiverId, vacanteId } = req.body;

    // Validación de campos según el remitente
    if (!contenido || !vacanteId || !receiverId) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const nuevoMensaje = await prisma.mensaje.create({
            data: {
                contenido,
                senderType,
                vacanteId: parseInt(vacanteId),
                receiverId: parseInt(receiverId), // En tu DB el receiver siempre es Egresado
                senderEmpresaId: senderType === 'EMPRESA' ? parseInt(senderEmpresaId) : null,
                senderEgresadoId: senderType === 'USUARIO' ? parseInt(senderEgresadoId) : null,
                
                // Si envía la empresa, creamos notificación para el egresado
                ...(senderType === 'EMPRESA' && {
                    notificacion: {
                        create: {
                            tipo: 'MENSAJE_NUEVO',
                            contenido: `La empresa te ha enviado un mensaje`,
                            egresadoId: parseInt(receiverId)
                        }
                    }
                })
            }
        });
        res.status(201).json(nuevoMensaje);
    } catch (error) {
        console.error("Error al enviar mensaje:", error.message);
        res.status(500).json({ error: "No se pudo enviar el mensaje" });
    }
});

/**
 * 2. OBTENER HISTORIAL
 * Verifica el estado 'chatActivo' en la tabla Postulacion para bloquear al egresado si es necesario.
 */
router.get('/historial/:egresadoId/:empresaId/:vacanteId', async (req, res) => {
    const eId = parseInt(req.params.egresadoId);
    const empId = parseInt(req.params.empresaId);
    const vId = parseInt(req.params.vacanteId);

    try {
        // 1. Validamos si el chat está activo para esta postulación específica
        const postulacion = await prisma.postulacion.findFirst({
            where: { 
                egresadoId: eId, 
                vacanteId: vId 
            }
        });

        // 2. Buscamos los mensajes entre ambas partes para esta vacante
        const mensajes = await prisma.mensaje.findMany({
            where: {
                vacanteId: vId,
                OR: [
                    { senderEmpresaId: empId, receiverId: eId },
                    { senderEgresadoId: eId, receiverId: empId }
                ]
            },
            orderBy: { fechaEnvio: 'asc' }
        });
        
        res.json({
            mensajes: mensajes,
            // Si la empresa desactivó el chat, enviamos false para que el front bloquee el input
            chatActivo: postulacion ? postulacion.chatActivo : true 
        });
    } catch (error) {
        console.error("Error al cargar historial:", error.message);
        res.status(500).json({ error: "Error al cargar historial" });
    }
});

/**
 * 3. MARCAR COMO LEÍDO
 */
router.put('/leer/:egresadoId/:empresaId', async (req, res) => {
    try {
        await prisma.mensaje.updateMany({
            where: {
                receiverId: parseInt(req.params.egresadoId),
                senderEmpresaId: parseInt(req.params.empresaId),
                read: false
            },
            data: { read: true }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar lectura" });
    }
});

/**
 * 4. ACTUALIZAR ESTADO DEL CHAT (BLOQUEO)
 * Este es el endpoint que llama la empresa para cerrar o abrir el chat.
 */
router.put('/status-chat', async (req, res) => {
    const { usuarioId, vacanteId, activo } = req.body;

    try {
        await prisma.postulacion.update({
            where: {
                vacanteId_egresadoId: { // Usamos el ID único compuesto de tu esquema
                    vacanteId: parseInt(vacanteId),
                    egresadoId: parseInt(usuarioId)
                }
            },
            data: { 
                chatActivo: activo 
            }
        });
        
        res.json({ 
            success: true, 
            message: activo ? "Chat habilitado" : "Chat bloqueado para el postulante" 
        });
    } catch (error) {
        console.error("Error al cambiar status chat:", error.message);
        res.status(500).json({ error: "No se pudo cambiar el estado del chat" });
    }
});

/**
 * 5. MIS CHATS (Para la lista de la izquierda de la empresa)
 */
// --- ACTUALIZAR EN EL BACKEND ---
// Cambiamos el nombre para que coincida con el frontend
/**
 * 5. MIS CHATS (Vista Empresa)
 * Muestra los egresados con los que la empresa ha hablado.
 */
router.get('/mis-chats/empresa/:empresaId', async (req, res) => {
    const empresaId = parseInt(req.params.empresaId);
    try {
        const conversaciones = await prisma.mensaje.findMany({
            where: {
                OR: [{ senderEmpresaId: empresaId }, { receiverId: -1 }] // receiverId en tu DB siempre es egresado, así que buscamos por emisor
            },
            where: { senderEmpresaId: empresaId },
            distinct: ['receiverId', 'vacanteId'],
            include: {
                receiver: { select: { id: true, nombres: true, apellidos: true } },
                vacante: { select: { titulo: true } }
            },
            orderBy: { fechaEnvio: 'desc' }
        });

        const resultado = conversaciones.map(c => ({
            usuarioId: c.receiverId,
            vacanteId: c.vacanteId,
            usuario: {
                id: c.receiver.id,
                nombre: `${c.receiver.nombres} ${c.receiver.apellidos}`
            },
            vacante: { titulo: c.vacante.titulo },
            ultimoMensaje: c.contenido
        }));
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener chats de empresa" });
    }
});

/**
 * 6. MIS CHATS (Vista Egresado/Estudiante)
 * Muestra las empresas con las que el estudiante tiene chats.
 */
router.get('/mis-chats/egresado/:egresadoId', async (req, res) => {
    const eId = parseInt(req.params.egresadoId);
    try {
        const conversaciones = await prisma.mensaje.findMany({
            where: {
                OR: [
                    { receiverId: eId },
                    { senderEgresadoId: eId }
                ]
            },
            distinct: ['vacanteId'],
            include: {
                senderEmpresa: { select: { id: true, nombre: true } },
                vacante: { select: { titulo: true } }
            },
            orderBy: { fechaEnvio: 'desc' }
        });

        const resultado = conversaciones.map(c => ({
            vacanteId: c.vacanteId,
            empresaId: c.senderEmpresaId || c.vacante?.empresaId, 
            nombreEmpresa: c.senderEmpresa?.nombre || "Empresa Aliada",
            tituloVacante: c.vacante?.titulo || "Vacante",
            ultimoMensaje: c.contenido
        }));

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener chats del egresado" });
    }
});

export default router;