// En tu archivo routes/cvsRoutes.js
import express from "express";
import { guardarCV } from "../controllers/cvsController.js"; 
import authMiddleware from "../middleware/authMiddleware.js"; // ¡No olvides incluir tu middleware!

const router = express.Router();
router.post("/guardar", authMiddleware, guardarCV);

export default router;