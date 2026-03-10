import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { crearEstudiante, loginEstudiante } from "../controllers/estudianteController.js";

const router = Router();

// Rutas públicas
router.post("/registro", crearEstudiante);
router.post("/login", loginEstudiante);

// Ejemplo de ruta protegida (se necesita el authMiddleware para funcionar)
router.get("/perfil", authMiddleware, (req, res) => {
    res.json({ message: "Perfil del estudiante", user: req.user });
});

export default router;