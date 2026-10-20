import jwt from 'jsonwebtoken';

import { JWT_SECRET } from "../config/jwtSecret.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "No autorizado: falta token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verifica el token usando la misma clave secreta
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Inyectamos el ID del usuario para usarlo en los controladores
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};