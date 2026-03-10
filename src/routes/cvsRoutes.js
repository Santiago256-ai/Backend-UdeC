// src/routes/cvsRoutes.js
import express from 'express';
import * as cvsController from '../controllers/cvsController.js'; 
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/guardar', authMiddleware, cvsController.guardarCV);

export default router;