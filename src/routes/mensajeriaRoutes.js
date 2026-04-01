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
        await prisma.mensaje.updateMany({
            where: {
                vacanteId: vId,
                senderEgresadoId: eId,
                receiverId: empId,
                read: false
            },
            data: { read: true }
        });
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
 * 3. MARCAR COMO LEÍDO (Versión Empresa)
 */
router.put('/leer-mensajes', async (req, res) => {
    const { egresadoId, empresaId, vacanteId } = req.body; // Recibimos datos por el body
    try {
        await prisma.mensaje.updateMany({
            where: {
                vacanteId: parseInt(vacanteId),
                senderEgresadoId: parseInt(egresadoId), // Mensajes del estudiante
                receiverId: parseInt(empresaId),        // Recibidos por la empresa
                read: false
            },
            data: { read: true }
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error al marcar lectura:", error);
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
/**
 * 5. MIS CHATS (Vista Empresa) - ACTUALIZADO CON CONTADOR
 */
router.get('/mis-chats/empresa/:empresaId', async (req, res) => {
    const empresaId = parseInt(req.params.empresaId);
    try {
        // 1. Obtenemos las conversaciones base
        const conversaciones = await prisma.mensaje.findMany({
            where: { 
                OR: [
                    { senderEmpresaId: empresaId },
                    { receiverId: empresaId } // Por si el egresado inició el chat
                ]
            },
            distinct: ['vacanteId', 'senderEgresadoId', 'receiverId'], 
            include: {
                receiver: { select: { id: true, nombres: true, apellidos: true } },
                senderEgresado: { select: { id: true, nombres: true, apellidos: true } },
                vacante: { select: { titulo: true } }
            },
            orderBy: { fechaEnvio: 'desc' }
        });

        // 2. Para cada conversación, contamos cuántos mensajes NO ha leído la empresa
        const resultado = await Promise.all(conversaciones.map(async (c) => {
            // Determinamos quién es el egresado en esta conversación
            const esRemitenteEgresado = c.senderEgresadoId !== null;
            const egresadoId = esRemitenteEgresado ? c.senderEgresadoId : c.receiverId;
            const egresadoData = esRemitenteEgresado ? c.senderEgresado : c.receiver;

            // CONTADOR DE PENDIENTES: Mensajes donde el receptor es la empresa y read es false
            const pendientes = await prisma.mensaje.count({
                where: {
                    vacanteId: c.vacanteId,
                    senderEgresadoId: egresadoId,
                    receiverId: empresaId,
                    read: false
                }
            });

            return {
                usuarioId: egresadoId,
                vacanteId: c.vacanteId,
                usuario: {
                    id: egresadoId,
                    nombre: `${egresadoData.nombres} ${egresadoData.apellidos}`
                },
                vacante: { titulo: c.vacante.titulo },
                ultimoMensaje: c.contenido,
                pendientes: pendientes // <--- ¡AQUÍ ESTÁ LA MAGIA!
            };
        }));

        res.json(resultado);
    } catch (error) {
        console.error("Error:", error);
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