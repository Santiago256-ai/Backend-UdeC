import admin from "firebase-admin";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // 1. Log para ver qué recibe realmente el servidor
        console.log("Token recibido en el header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No autorizado: Formato de token inválido" });
        }

        const token = authHeader.split(" ")[1];

        // 2. Validación de seguridad extra contra el string "null"
        if (!token || token === "null" || token === "undefined") {
             return res.status(401).json({ message: "No autorizado: El token es nulo" });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        // 3. Log detallado del error de Firebase
        console.error("Error específico de Firebase al verificar token:", error.message);
        return res.status(403).json({ message: "No autorizado: Token inválido o expirado" });
    }
};