import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRol } from '../middleware/requireRol.js';
import { 
    obtenerNotificacionesEgresado, 
    obtenerNotificacionesEmpresa,
    marcarNotificacionLeida,
    eliminarNotificacion // <--- Asegúrate de importarla
} from '../controllers/notificacionController.js';

const router = express.Router();

router.get('/egresado/:egresadoId', obtenerNotificacionesEgresado);
// Sólo la propia empresa: el controlador compara :empresaId con el del token.
router.get("/empresa/:empresaId", authMiddleware, requireRol("empresa"), obtenerNotificacionesEmpresa);
router.put('/:id/leer', marcarNotificacionLeida);

// --- ESTA ES LA RUTA QUE TE FALTA ---
router.delete('/:id', eliminarNotificacion);

export default router;