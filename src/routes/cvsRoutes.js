import express from 'express';
import { getCV, upsertCV } from '../controllers/cvController.js'; // Ojo con el .js al final

const router = express.Router();

router.get('/:egresadoId', cvController.getCV);
router.post('/:egresadoId', cvController.upsertCV);

export default router;