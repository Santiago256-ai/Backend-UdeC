// backend/routes/authRoutes.js

import express from "express";
import { 
    register, 
    // 🚨 Importamos las funciones específicas de login por rol
    loginEgresado, 
    loginEmpresa, 
    socialLogin 
} from "../controllers/authController.js"; 

const router = express.Router();

router.post("/register", register);

// 🚨 FIX CRÍTICO: Rutas específicas para el login que tu frontend está usando.
// La URL final será: POST /api/auth/egresado/login
router.post("/egresado/login", loginEgresado); 

// La URL final será: POST /api/auth/empresa/login
router.post("/empresa/login", loginEmpresa); 

// Ruta de Login Social
router.post("/social-login", socialLogin); 

export default router;