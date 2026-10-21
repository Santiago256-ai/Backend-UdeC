import express from 'express';
// Importamos las funciones específicas del controlador
import { getCV, upsertCV } from '../controllers/cvController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRol } from '../middleware/requireRol.js';

const router = express.Router();

// 🛡️ La hoja de vida sólo la lee y la guarda el propio egresado (CrearCV.jsx). La
// de otro egresado responde lo mismo que un CV que no existe, para no revelar
// cuáles existen. La empresa ve las hojas de vida por /postulaciones/vacante/:id.
const soloSuPropioCV = (req, res, next) => {
    if (parseInt(req.params.egresadoId) !== req.user.id) {
        return res.status(404).json({ message: "CV no encontrado" });
    }
    next();
};

const soloElEgresado = [authMiddleware, requireRol('egresado'), soloSuPropioCV];

router.get('/:egresadoId', soloElEgresado, getCV);
router.post('/:egresadoId', soloElEgresado, upsertCV);

export default router;
