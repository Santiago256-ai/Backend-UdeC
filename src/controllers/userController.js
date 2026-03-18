// backend/controllers/userController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const obtenerTodosLosUsuarios = async (req, res) => {
    try {
        // Traemos todos los usuarios con rol 'estudiante' (que son tus egresados)
        // Incluimos el conteo de sus postulaciones para que el Admin vea qué tan activos son
        const usuarios = await prisma.usuario.findMany({
            where: {
                rol: "estudiante"
            },
            include: {
                _count: {
                    select: { postulaciones: true }
                }
            },
            orderBy: { id: "desc" }
        });

        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "No se pudieron cargar los usuarios." });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.usuario.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario." });
    }
};