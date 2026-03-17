import express from 'express';
import { getCV, upsertCV } from '../controllers/cvController.js'; // Ojo con el .js al final

const router = express.Router();

router.get('/:usuarioId', getCV);
router.post('/:usuarioId', upsertCV);

export default router;