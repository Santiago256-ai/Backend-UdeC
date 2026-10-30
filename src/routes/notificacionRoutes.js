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

// Sólo las propias: el controlador compara el id de la ruta (o el dueño de la
// notificación) con el del token.
router.get('/egresado/:egresadoId', authMiddleware, requireRol("egresado"), obtenerNotificacionesEgresado);
// Sólo la propia empresa: el controlador compara :empresaId con el del token.
router.get("/empresa/:empresaId", authMiddleware, requireRol("empresa"), obtenerNotificacionesEmpresa);
// Marcar como leída: la usan NotificacionesEgresado y NotificacionesEmpresa.
router.put('/:id/leer', authMiddleware, requireRol("egresado", "empresa"), marcarNotificacionLeida);

// Borrar: sólo NotificacionesEgresado.
router.delete('/:id', authMiddleware, requireRol("egresado"), eliminarNotificacion);

export default router;