import express from 'express';
// Importamos las funciones específicas del controlador
import { getCV, upsertCV } from '../controllers/cvController.js'; 

const router = express.Router();

// ❌ ANTES: router.get('/:egresadoId', cvController.getCV);
// ✅ AHORA: Usamos la función directamente
router.get('/:egresadoId', getCV);
router.post('/:egresadoId', upsertCV);

export default router;