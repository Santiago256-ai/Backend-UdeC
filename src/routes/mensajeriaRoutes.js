import express from 'express';
import { PrismaClient } from '@prisma/client';
import { enviarCorreoNuevoMensaje } from '../services/emailService.js'; // 👈 IMPORTACIÓN AÑADIDA

const router = express.Router();
const prisma = new PrismaClient();

/**
 * 1. ENVIAR MENSAJE
 * Sincronizado con los modelos Egresado y Empresa, y envío de correo.
 */
router.post('/enviar', async (req, res) => {
    const { contenido, senderType, senderEmpresaId, senderEgresadoId, receiverId, vacanteId } = req.body;

    if (!contenido || !vacanteId || !receiverId) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        // 1. Buscamos el nombre de la vacante Y su empresaId dueña
        const vacanteInfo = await prisma.vacante.findUnique({
            where: { id: parseInt(vacanteId) },
            select: { titulo: true, empresaId: true }
        });

        // 2. CREAMOS EL MENSAJE PRIMERO
        const nuevoMensaje = await prisma.mensaje.create({
            data: {
                contenido,
                senderType,
                vacanteId: parseInt(vacanteId),
                receiverId: parseInt(receiverId),
                senderEmpresaId: senderType === 'EMPRESA' ? parseInt(senderEmpresaId) : null,
                senderEgresadoId: senderType === 'USUARIO' ? parseInt(senderEgresadoId) : null,
            }
        });

        // 3. CREAMOS LA NOTIFICACIÓN DEPENDIENDO DE QUIÉN ENVÍA
        if (senderType === 'EMPRESA') {
            // Si envía la empresa, notificamos al egresado (Notificación interna)
            await prisma.notificacion.create({
                data: {
                    tipo: 'MENSAJE',
                    contenido: `Nuevo mensaje sobre la vacante: "${vacanteInfo?.titulo || 'Oferta laboral'}"`,
                    egresadoId: parseInt(receiverId),
                    empresaId: null, // No es para la empresa
                    referenciaId: parseInt(vacanteId),
                    mensajeId: nuevoMensaje.id,
                    vista: false
                }
            });

            // ✉️ NUEVO: DISPARAR NOTIFICACIÓN POR CORREO AL EGRESADO
            // Ejecutamos consultas rápidas para armar los campos personalizados del correo
            const [egresadoInfo, empresaInfo] = await Promise.all([
                prisma.egresado.findUnique({
                    where: { id: parseInt(receiverId) },
                    select: { correo: true, nombres: true }
                }),
                prisma.empresa.findUnique({
                    where: { id: parseInt(senderEmpresaId) },
                    select: { nombre: true }
                })
            ]);

            if (egresadoInfo && empresaInfo) {
                // Se envía de forma asíncrona para no bloquear el hilo de respuesta
                enviarCorreoNuevoMensaje({
                    correo: egresadoInfo.correo,
                    nombres: egresadoInfo.nombres,
                    nombreEmpresa: empresaInfo.nombre,
                    tituloVacante: vacanteInfo?.titulo || 'Oferta laboral',
                    contenidoMensaje: contenido,
                    fechaEnvio: nuevoMensaje.fechaEnvio,
                    vacanteId: parseInt(vacanteId),
                    mensajeId: nuevoMensaje.id
                });
            }

        } else if (senderType === 'USUARIO') {
            // Si envía el egresado, notificamos a la empresa dueña de la vacante
            await prisma.notificacion.create({
                data: {
                    tipo: 'MENSAJE',
                    contenido: `Tienes un nuevo mensaje de un candidato en la vacante: "${vacanteInfo?.titulo || 'Oferta laboral'}"`,
                    empresaId: vacanteInfo.empresaId, 
                    egresadoId: parseInt(senderEgresadoId), 
                    referenciaId: parseInt(vacanteId), 
                    mensajeId: nuevoMensaje.id,
                    vista: false
                }
            });
        }

        res.status(201).json(nuevoMensaje);
    } catch (error) {
        console.error("Error al enviar mensaje:", error.message);
        res.status(500).json({ error: "No se pudo enviar el mensaje" });
    }
});

/**
 * 2. OBTENER HISTORIAL (Versión Final Blindada)
 * Filtra estrictamente por vacante y empresa para evitar fugas de datos.
 */
router.get('/historial/:egresadoId/:empresaId/:vacanteId', async (req, res) => {
    const eId = parseInt(req.params.egresadoId);
    const empId = parseInt(req.params.empresaId);
    const vId = parseInt(req.params.vacanteId);

    if (isNaN(eId) || isNaN(empId) || isNaN(vId)) {
        return res.status(400).json({ error: "IDs inválidos proporcionados." });
    }

    try {
        const vacanteVerificada = await prisma.vacante.findFirst({
            where: {
                id: vId,
                empresaId: empId 
            }
        });

        if (!vacanteVerificada) {
            console.warn(`Intento de acceso no autorizado: Empresa ${empId} a vacante ${vId}`);
            return res.status(403).json({ 
                error: "Acceso denegado. Esta vacante no pertenece a su empresa." 
            });
        }

        const postulacion = await prisma.postulacion.findUnique({
            where: {
                vacanteId_egresadoId: {
                    vacanteId: vId,
                    egresadoId: eId
                }
            }
        });

        if (!postulacion) {
            return res.status(404).json({ error: "No existe una postulación para este chat." });
        }

        const mensajes = await prisma.mensaje.findMany({
            where: {
                vacanteId: vId,
                OR: [
                    { senderEmpresaId: empId, receiverId: eId },
                    { senderEgresadoId: eId, receiverId: empId }
                ]
            },
            orderBy: { 
                fechaEnvio: 'asc' 
            }
        });
        
        res.json({
            mensajes: mensajes,
            chatActivo: postulacion.chatActivo 
        });

    } catch (error) {
        console.error("Error crítico en historial:", error.message);
        res.status(500).json({ error: "Error interno del servidor al cargar mensajes." });
    }
});

/**
 * 3. MARCAR COMO LEÍDO (Versión Empresa)
 */
router.put('/leer-mensajes', async (req, res) => {
    const { egresadoId, empresaId, vacanteId } = req.body; 
    try {
        await prisma.mensaje.updateMany({
            where: {
                vacanteId: parseInt(vacanteId),
                senderEgresadoId: parseInt(egresadoId),
                receiverId: parseInt(empresaId), 
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
 */
router.put('/status-chat', async (req, res) => {
    const { usuarioId, vacanteId, activo } = req.body;

    try {
        await prisma.postulacion.update({
            where: {
                vacanteId_egresadoId: { 
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
 * 5. MIS CHATS (Vista Empresa) - CORREGIDO Y BLINDADO
 */
router.get('/mis-chats/empresa/:empresaId', async (req, res) => {
    const empresaId = parseInt(req.params.empresaId);
    
    try {
        const postulaciones = await prisma.postulacion.findMany({
            where: {
                vacante: { empresaId: empresaId },
                vacante: {
                    mensajes: {
                        some: {
                            OR: [
                                { senderEmpresaId: empresaId },
                                { receiverId: empresaId }
                            ]
                        }
                    }
                }
            },
            include: {
                egresado: { 
                    select: { id: true, nombres: true, apellidos: true } 
                },
                vacante: { 
                    select: { id: true, titulo: true } 
                }
            }
        });

        const resultado = await Promise.all(postulaciones.map(async (p) => {
            const egresadoId = p.egresadoId;
            
            const pendientes = await prisma.mensaje.count({
                where: {
                    vacanteId: p.vacanteId,
                    senderEgresadoId: egresadoId,
                    receiverId: empresaId,
                    read: false
                }
            });

            const ultimoMsg = await prisma.mensaje.findFirst({
                where: {
                    vacanteId: p.vacanteId,
                    OR: [
                        { senderEgresadoId: egresadoId, receiverId: empresaId },
                        { senderEmpresaId: empresaId, receiverId: egresadoId }
                    ]
                },
                orderBy: { fechaEnvio: 'desc' }
            });

            if (!ultimoMsg && pendientes === 0) return null;

            return {
                usuarioId: egresadoId,
                vacanteId: p.vacanteId,
                usuario: {
                    id: egresadoId,
                    nombre: `${p.egresado.nombres} ${p.egresado.apellidos}`
                },
                vacante: { titulo: p.vacante.titulo },
                ultimoMensaje: ultimoMsg?.contenido || "",
                fechaUltimo: ultimoMsg?.fechaEnvio || p.fecha,
                pendientes: pendientes
            };
        }));

        const resultadoFinal = resultado
            .filter(chat => chat !== null)
            .sort((a, b) => new Date(b.fechaUltimo) - new Date(a.fechaUltimo));

        res.json(resultadoFinal);
    } catch (error) {
        console.error("Error al obtener chats:", error);
        res.status(500).json({ error: "Error al obtener chats" });
    }
});

/**
 * 6. MIS CHATS (Vista Egresado/Estudiante)
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
                vacante: { 
                    select: { 
                        titulo: true, 
                        empresaId: true,
                        empresa: { select: { nombre: true } } 
                    } 
                }
            },
            orderBy: { fechaEnvio: 'desc' }
        });

        const resultado = conversaciones.map(c => ({
            vacanteId: c.vacanteId,
            empresaId: c.senderEmpresaId || c.vacante?.empresaId, 
            nombreEmpresa: c.vacante?.empresa?.nombre || c.senderEmpresa?.nombre || "Empresa Aliada",
            tituloVacante: c.vacante?.titulo || "Vacante",
            ultimoMensaje: c.contenido,
            ultimoMsgSenderType: c.senderType,
            leido: c.read,
            fechaUltimo: c.fechaEnvio
        }));

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener chats del egresado" });
    }
});

/**
 * 7. MARCAR COMO LEÍDO (Versión Egresado)
 */
router.put('/leer-mensajes-egresado', async (req, res) => {
    const { egresadoId, empresaId, vacanteId } = req.body;
    try {
        await prisma.mensaje.updateMany({
            where: {
                vacanteId: parseInt(vacanteId),
                senderEmpresaId: parseInt(empresaId), 
                receiverId: parseInt(egresadoId), 
                read: false
            },
            data: { read: true }
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Error al marcar lectura egresado:", error);
        res.status(500).json({ error: "No se pudo actualizar el estado de lectura" });
    }
});

export default router;