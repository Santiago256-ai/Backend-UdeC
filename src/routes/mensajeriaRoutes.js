import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// --- 1. ENVIAR MENSAJE (Corregido para incluir vacanteId) ---
router.post('/enviar', async (req, res) => {
    const { contenido, senderType, senderId, receiverId, vacanteId } = req.body;

    if (!contenido || !senderId || !receiverId || !vacanteId) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const nuevoMensaje = await prisma.mensaje.create({
            data: {
                contenido,
                senderType, 
                receiverId: parseInt(receiverId),
                vacanteId: parseInt(vacanteId), // ✅ Ahora se guarda el ID de la vacante
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
        console.error("Error en DB:", error.message);
        res.status(500).json({ error: "No se pudo enviar el mensaje" });
    }
});

// --- 2. OBTENER HISTORIAL (Corregido: añadida vacanteId para evitar el 404) ---
router.get('/historial/:usuarioId/:empresaId/:vacanteId', async (req, res) => {
    const uId = parseInt(req.params.usuarioId);
    const eId = parseInt(req.params.empresaId);
    const vId = parseInt(req.params.vacanteId);

    try {
        const mensajes = await prisma.mensaje.findMany({
            where: {
                vacanteId: vId, // Filtramos por la vacante específica
                OR: [
                    { senderEmpresaId: eId, receiverId: uId },
                    { senderUsuarioId: uId, receiverId: eId }
                ]
            },
            orderBy: { fechaEnvio: 'asc' }
        });
        
        // Enviamos un objeto que incluya la bandera de chat activo
        res.json({
            mensajes: mensajes,
            chatActivo: true // Puedes añadir lógica aquí para cerrar chats si la vacante expiró
        });
    } catch (error) {
        res.status(500).json({ error: "Error al cargar historial" });
    }
});

// --- 3. MARCAR COMO LEÍDO (Nueva: evita el error 404 de la consola) ---
router.put('/leer/:usuarioId/:empresaId', async (req, res) => {
    try {
        await prisma.mensaje.updateMany({
            where: {
                receiverId: parseInt(req.params.usuarioId),
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

// --- 4. LISTA DE CONVERSACIONES (Corregida con JOINs para traer nombres) ---
router.get('/mis-conversaciones/:usuarioId', async (req, res) => {
    const usuarioId = parseInt(req.params.usuarioId);

    try {
        // Esta consulta busca mensajes únicos agrupados por vacante y empresa
        const mensajes = await prisma.mensaje.findMany({
            where: {
                OR: [
                    { senderUsuarioId: usuarioId },
                    { receiverId: usuarioId }
                ]
            },
            include: {
                vacante: { select: { titulo: true } },
                senderEmpresa: { select: { nombre: true } }
            },
            orderBy: { fechaEnvio: 'desc' },
            distinct: ['vacanteId'] // Trae solo el último mensaje de cada vacante diferente
        });

        // Formateamos la respuesta para que el Frontend la entienda
        const formateado = mensajes.map(m => ({
            vacanteId: m.vacanteId,
            empresaId: m.senderEmpresaId || m.receiverId,
            tituloVacante: m.vacante?.titulo || "Vacante",
            nombreEmpresa: m.senderEmpresa?.nombre || "Empresa",
            ultimoMensaje: m.contenido
        }));
        
        res.json(formateado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener conversaciones" });
    }
});

export default router;