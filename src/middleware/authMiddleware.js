import admin from "firebase-admin";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No autorizado: Token faltante" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Error en authMiddleware:", error);
        return res.status(403).json({ message: "No autorizado: Token inválido" });
    }
};