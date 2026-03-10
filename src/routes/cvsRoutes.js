import express from "express";
import { guardarCV } from "../controllers/cvsController.js"; 
// Usamos { } porque en el middleware usamos 'export const'
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// La ruta queda protegida
router.post("/guardar", authMiddleware, guardarCV);

export default router;