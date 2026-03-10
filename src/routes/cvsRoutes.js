import express from "express";
import { guardarCV } from "../controllers/cvsController.js"; 
// Sube un nivel (sale de routes), sube otro (sale de src) y entra a middleware
import { authMiddleware } from "../../middleware/authMiddleware.js"; 

const router = express.Router();
router.post("/guardar", authMiddleware, guardarCV);

export default router;