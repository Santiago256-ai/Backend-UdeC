import express from "express";
// 1. Agregamos obtenerMiCV a la importación
import { guardarCV, obtenerMiCV } from "../controllers/cvsController.js"; 
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// 2. Ruta para guardar (la que ya tenías)
router.post("/guardar", authMiddleware, guardarCV);

// 3. NUEVA RUTA para que el formulario cargue los datos automáticamente
router.get("/mi-cv", authMiddleware, obtenerMiCV);

export default router;