import prisma from "../prismaClient.js";

export const obtenerNotificacionesEgresado = async (req, res) => {
    try {
        const { egresadoId } = req.params;
        const notificaciones = await prisma.notificacion.findMany({
            where: {
                egresadoId: parseInt(egresadoId)
            },
            orderBy: {
                fecha: 'desc' // Las más recientes primero
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