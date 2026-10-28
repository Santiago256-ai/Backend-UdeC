import prisma from "../prismaClient.js";

export const obtenerNotificacionesEgresado = async (req, res) => {
    try {
        const { egresadoId } = req.params;
        const notificaciones = await prisma.notificacion.findMany({
            where: {
                egresadoId: parseInt(egresadoId),
                empresaId: null // 👈 AQUÍ ESTÁ LA MAGIA: Excluimos las que son para la empresa
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

export const marcarNotificacionLeida = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.notificacion.update({
            where: { id: parseInt(id) },
            data: { vista: true }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "No se pudo marcar como leída" });
    }
};

// Borrar una notificación específica por ID
export const eliminarNotificacion = async (req, res) => {
    try {
        const { id } = req.params;
        
        await prisma.notificacion.delete({
            where: {
                id: parseInt(id)
            }
        });
        
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