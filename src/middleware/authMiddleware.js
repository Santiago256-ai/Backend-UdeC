// src/middleware/authMiddleware.js
import prisma from "../prismaClient.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: "No autorizado" });
        }

        // El token ahora es el ID que guardamos en localStorage
        const userId = parseInt(authHeader); 

        const usuario = await prisma.usuario.findUnique({
            where: { id: userId }
        });

        if (!usuario) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        // Inyectamos el usuario para que la ruta lo use
        req.user = usuario; 
        
        next();
    } catch (error) {
        return res.status(403).json({ message: "Error en la validación" });
    }
};