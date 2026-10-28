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
import { loginAdmin } from "../controllers/adminAuthController.js";

const router = express.Router();

// --- RUTAS DE ACCESO ---
router.post("/register", register);
router.post("/login", login);
router.post("/social-login", socialLogin);

// Panel de administración: sólo la tabla Administrador, token de 2 h con aud "admin".
// El límite de intentos lo pone el Firewall de Vercel con la ruta exacta. Express
// no distingue mayúsculas ni la barra final, así que /API/auth/admin/LOGIN o
// /api/auth/admin/login/ se saltarían esa regla: cualquier otra forma de la ruta
// sigue como si no existiera (el mismo 404 que una ruta desconocida).
const RUTA_LOGIN_ADMIN = "/api/auth/admin/login";
const soloRutaExacta = (req, res, next) =>
    req.originalUrl.split("?")[0] === RUTA_LOGIN_ADMIN ? next() : next("router");
router.post("/admin/login", soloRutaExacta, loginAdmin);

// --- RUTAS DE RECUPERACIÓN (SISTEMA NATIVO BD) ---
// 1. Para cuando el usuario pone su correo en "¿Olvidaste tu contraseña?"
router.post("/request-password-reset", requestPasswordReset);

// 2. Para cuando el usuario hace clic en el enlace del correo y pone la nueva clave
router.post("/reset-password", resetPassword);

export default router;