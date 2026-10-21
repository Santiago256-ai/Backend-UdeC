// backend/routes/userRoutes.js
import express from "express";
import { bloqueoTemporal } from '../middleware/bloqueoTemporal.js';

const router = express.Router();

// obtenerTodosLosEgresados, eliminarEgresado y actualizarEgresadoAdmin, hasta que
// exista el rol de administrador (sólo las usa el panel de admin)
router.get('/admin/todos', bloqueoTemporal);
router.delete('/:id', bloqueoTemporal);
router.put('/:id', bloqueoTemporal);

export default router;
