import express from 'express';
const router = express.Router();
import { procesarConsultaAgente } from '../controllers/iaController.js';

// CAMBIO AQUÍ: Agrega las llaves { } alrededor de authMiddleware
import { authMiddleware } from '../middleware/authMiddleware.js'; 

router.post('/consultar', authMiddleware, procesarConsultaAgente);

export default router;