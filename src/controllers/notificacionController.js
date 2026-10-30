import prisma from "../prismaClient.js";
import { idDeRuta } from "../utils/panelAdmin.js";

// Ronda "dueño", entrega 3 (2026-10): cada sesión sólo ve y toca sus propias
// notificaciones. Se comprueban el rol Y el id del token (los ids se repiten
// entre egresados y empresas). Ajena, inexistente o id no numérico: el mismo 404.
const NO_ENCONTRADA = { error: "Notificación no encontrada." };

// Las notificaciones de una empresa también llevan el egresadoId del postulante:
// las del egresado son las suyas SIN empresa (lo mismo que muestra su lista).
const notificacionesPropias = (usuario) => {
    if (!Number.isSafeInteger(usuario?.id)) return null;
    if (usuario.rol === "egresado") return { egresadoId: usuario.id, empresaId: null };
    if (usuario.rol === "empresa") return { empresaId: usuario.id };
    return null;
};

export const obtenerNotificacionesEgresado = async (req, res) => {
    try {
        // Sólo el propio egresado (requireRol("egresado") ya filtró el rol).
        const egresadoId = Number(req.params.egresadoId);
        if (req.user?.rol !== "egresado" || !Number.isSafeInteger(req.user.id) || egresadoId !== req.user.id) {
            return res.status(404).json({ error: "Egresado no encontrado." });
        }
        const notificaciones = await prisma.notificacion.findMany({
            where: {
                egresadoId,
                empresaId: null // 👈 AQUÍ ESTÁ LA MAGIA: Excluimos las que son para la empresa
            },
            // Sólo lo que leen NotificacionesEgresado y el contador de Avisos.
            select: {
                id: true,
                tipo: true,
                contenido: true,
                fecha: true,
                vista: true,
                referenciaId: true,
                postulacionId: true,
                mensajeId: true
            },
            orderBy: {
                fecha: 'desc' 
            }
        });
        res.json(notificaciones);
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// La usan el egresado y la empresa, cada uno con las suyas.
export const marcarNotificacionLeida = async (req, res) => {
    try {
        const id = idDeRuta(req.params.id);
        const propias = notificacionesPropias(req.user);
        if (id === null || !propias) return res.status(404).json(NO_ENCONTRADA);

        const { count } = await prisma.notificacion.updateMany({
            where: { id, ...propias },
            data: { vista: true }
        });
        if (count === 0) return res.status(404).json(NO_ENCONTRADA);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "No se pudo marcar como leída" });
    }
};

// Borrar una notificación específica por ID (sólo el egresado, las suyas)
export const eliminarNotificacion = async (req, res) => {
    try {
        const id = idDeRuta(req.params.id);
        const propias = notificacionesPropias(req.user);
        if (id === null || !propias) return res.status(404).json(NO_ENCONTRADA);

        const { count } = await prisma.notificacion.deleteMany({
            where: { id, ...propias }
        });
        if (count === 0) return res.status(404).json(NO_ENCONTRADA);
        
        res.json({ message: "Notificación eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar notificación:", error.message);
        res.status(500).json({ error: "No se pudo eliminar la notificación." });
    }
};

// Obtener notificaciones para una empresa específica
export const obtenerNotificacionesEmpresa = async (req, res) => {
    try {
        // Sólo la propia empresa (requireRol("empresa") ya filtró el rol). Otra
        // empresa, una inexistente o un id que no es número: el mismo 404.
        const empresaId = Number(req.params.empresaId);
        if (req.user?.rol !== "empresa" || !Number.isSafeInteger(req.user.id) || empresaId !== req.user.id) {
            return res.status(404).json({ error: "Empresa no encontrada." });
        }

        const notificaciones = await prisma.notificacion.findMany({
            where: {
                empresaId // Filtro directo ahora que existe en el Schema
            },
            // Sólo lo que leen NotificacionesEmpresa y el punto de pendientes del
            // panel. Sin la fila de la postulación (teléfono, calificación, comentario).
            select: {
                id: true,
                tipo: true,
                contenido: true,
                fecha: true,
                vista: true,
                referenciaId: true,
                postulacionId: true,
                mensajeId: true,
                egresadoId: true
            },
            orderBy: {
                fecha: 'desc'
            }
        });

        res.json(notificaciones);
    } catch (error) {
        console.error("❌ Error al obtener notificaciones empresa:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};