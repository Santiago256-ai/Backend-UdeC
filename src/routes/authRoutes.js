// backend/routes/authRoutes.js

import express from "express";
// ✅ IMPORTA LAS NUEVAS FUNCIONES DE RECUPERACIÓN
import { 
    register, 
    login, 
    socialLogin, 
    requestPasswordReset, // Solicitar el correo
    resetPassword         // Cambiar la clave final
} from "../controllers/authController.js";

const router = express.Router();

// --- RUTAS DE ACCESO ---
router.post("/register", register);
router.post("/login", login);
router.post("/social-login", socialLogin); 

// --- RUTAS DE RECUPERACIÓN (SISTEMA NATIVO BD) ---
// 1. Para cuando el usuario pone su correo en "¿Olvidaste tu contraseña?"
router.post("/request-password-reset", requestPasswordReset);

// 2. Para cuando el usuario hace clic en el enlace del correo y pone la nueva clave
router.post("/reset-password", resetPassword);

export default router;