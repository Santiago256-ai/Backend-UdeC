import express from 'express';
import { 
    obtenerNotificacionesEgresado, 
    marcarNotificacionLeida 
} from '../controllers/notificacionController.js';

const router = express.Router();

// Esta es la ruta que te da el error 404: /api/notificaciones/egresado/:id
router.get('/egresado/:egresadoId', obtenerNotificacionesEgresado);

// Esta es para cuando el usuario hace clic: /api/notificaciones/:id/leer
router.put('/:id/leer', marcarNotificacionLeida);

export default router;