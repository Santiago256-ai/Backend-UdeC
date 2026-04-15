import express from 'express';
const router = express.Router();
import { procesarConsultaAgente } from '../controllers/iaController.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Para que solo usuarios logueados lo usen

router.post('/consultar', authMiddleware, procesarConsultaAgente);

export default router;