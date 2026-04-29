import express from 'express';
import { 
    obtenerNotificacionesEgresado, 
    obtenerNotificacionesEmpresa,
    marcarNotificacionLeida,
    eliminarNotificacion // <--- Asegúrate de importarla
} from '../controllers/notificacionController.js';

const router = express.Router();

router.get('/egresado/:egresadoId', obtenerNotificacionesEgresado);
router.get("/empresa/:empresaId", obtenerNotificacionesEmpresa);
router.put('/:id/leer', marcarNotificacionLeida);

// --- ESTA ES LA RUTA QUE TE FALTA ---
router.delete('/:id', eliminarNotificacion); 
// Importa debugNotificaciones arriba, y luego añade:
router.get("/debug/todas", debugNotificaciones);

export default router;