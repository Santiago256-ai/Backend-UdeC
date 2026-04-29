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
// Obtener notificaciones para una empresa específica
export const obtenerNotificacionesEmpresa = async (req, res) => {
    try {
        const { empresaId } = req.params;

        const notificaciones = await prisma.notificacion.findMany({
            where: {
                empresaId: parseInt(empresaId) // Filtro directo ahora que existe en el Schema
            },
            include: {
                egresado: {
                    select: {
                        nombres: true,
                        apellidos: true
                    }
                },
                postulacion: {
                    include: {
                        vacante: {
                            select: { titulo: true }
                        }
                    }
                }
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

export const debugNotificaciones = async (req, res) => {
    try {
        const todas = await prisma.notificacion.findMany({
            orderBy: { id: 'desc' }
        });
        res.json(todas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};