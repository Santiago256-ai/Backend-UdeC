// src/middleware/authMiddleware.js

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        console.log("Header recibido:", authHeader);

        // 1. Validamos que el header exista y tenga formato Bearer
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No autorizado: Token faltante o formato incorrecto" });
        }

        // 2. Extraemos el token después de "Bearer "
        const token = authHeader.split(" ")[1];

        // 3. Verificamos que no sea la palabra "null"
        if (!token || token === "null" || token === "undefined") {
             return res.status(401).json({ message: "No autorizado: Token nulo" });
        }

        // --- AQUÍ LA MEJORA ---
        // Si más adelante decides usar JWT, aquí verificarías el token con jsonwebtoken:
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded;

        // Por ahora, permitimos el paso a la siguiente función
        next();
    } catch (error) {
        console.error("Error en authMiddleware:", error.message);
        return res.status(403).json({ message: "No autorizado: Error en la validación" });
    }
};