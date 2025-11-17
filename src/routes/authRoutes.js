// backend/routes/authRoutes.js

import express from "express";
// 🚨 IMPORTA LA NUEVA FUNCIÓN
import { register, login, socialLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// 🚨 NUEVA RUTA: POST /api/auth/social-login
router.post("/social-login", socialLogin); 

export default router;