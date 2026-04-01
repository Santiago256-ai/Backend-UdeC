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
 * 2. OBTENER HISTORIAL (Versión Blindada)
 * Agregamos validación de propiedad para que ninguna empresa vea chats ajenos.
 */
/**
 * 2. OBTENER HISTORIAL (Versión Final Blindada)
 * Filtra estrictamente por vacante y empresa para evitar fugas de datos.
 */
router.get('/historial/:egresadoId/:empresaId/:vacanteId', async (req, res) => {
    // 1. Sanitización de parámetros
    const eId = parseInt(req.params.egresadoId);
    const empId = parseInt(req.params.empresaId);
    const vId = parseInt(req.params.vacanteId);

    // Validación rápida de tipos
    if (isNaN(eId) || isNaN(empId) || isNaN(vId)) {
        return res.status(400).json({ error: "IDs inválidos proporcionados." });
    }

    try {
        // --- PASO 1: VALIDACIÓN DE SEGURIDAD (CROSS-TENANCY CHECK) ---
        // Buscamos si existe la vacante Y si pertenece a la empresa que hace la petición.
        // Si una empresa intenta ver un vId de otra empresa, esto devolverá null.
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

        // --- PASO 2: OBTENER ESTADO DEL CHAT Y POSTULACIÓN ---
        // Necesitamos saber si el chat está bloqueado (chatActivo)
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

        // --- PASO 3: BUSCAR MENSAJES DEL HILO ---
        // Filtramos por vacanteId. Como ya validamos arriba que vId es de empId,
        // esto garantiza que solo se vean mensajes propios.
        const mensajes = await prisma.mensaje.findMany({
            where: {
                vacanteId: vId,
                // Filtramos que los mensajes sean específicamente entre este egresado y esta empresa
                OR: [
                    { senderEmpresaId: empId, receiverId: eId },
                    { senderEgresadoId: eId, receiverId: empId }
                ]
            },
            orderBy: { 
                fechaEnvio: 'asc' // Cronología de chat estándar
            }
        });
        
        // --- PASO 4: RESPUESTA ---
        res.json({
            mensajes: mensajes,
            chatActivo: postulacion.chatActivo // Controla si el input del front se habilita
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
/**
 * 5. MIS CHATS (Vista Empresa) - CORREGIDO Y BLINDADO
 * Filtra para que una empresa solo vea candidatos con los que ELLA ha hablado.
 */
router.get('/mis-chats/empresa/:empresaId', async (req, res) => {
    const empresaId = parseInt(req.params.empresaId);
    
    try {
        const postulaciones = await prisma.postulacion.findMany({
            where: {
                // 1. La vacante debe ser de esta empresa
                vacante: { empresaId: empresaId },
                // 2. Filtro de seguridad: Solo si hay mensajes asociados a esta empresa
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
            
            // CONTADOR DE PENDIENTES: Específico de esta empresa y este egresado
            const pendientes = await prisma.mensaje.count({
                where: {
                    vacanteId: p.vacanteId,
                    senderEgresadoId: egresadoId,
                    receiverId: empresaId,
                    read: false
                }
            });

            // BUSCAMOS EL ÚLTIMO MENSAJE: Para la previsualización en la lista
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

            // Si por alguna razón extraña no hay mensajes específicos para esta empresa,
            // no devolvemos este chat en el mapeo (filtro de seguridad final)
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

        // Limpiamos los nulos y ordenamos por fecha (más reciente arriba)
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
    // ¡ESTA LÍNEA ES LA MÁS IMPORTANTE!
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