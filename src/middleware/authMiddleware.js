// src/middleware/authMiddleware.js
import prisma from "../prismaClient.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // 1. Validar que el header exista
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "No autorizado: formato de token inválido" });
        }

        // 2. Extraer solo el token (el ID) eliminando "Bearer "
        const token = authHeader.split(" ")[1]; 

        // 3. Convertir a entero y buscar
        const userId = parseInt(token);
        
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Token inválido" });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: userId }
        });

        if (!usuario) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        req.user = usuario; 
        next();
    } catch (error) {
        console.error("Error en authMiddleware:", error);
        return res.status(500).json({ message: "Error interno en la autenticación" });
    }
};