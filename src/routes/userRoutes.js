// backend/routes/userRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { bloqueoTemporal } from '../middleware/bloqueoTemporal.js';
import { requireRol } from "../middleware/requireRol.js";
import { obtenerTodosLosEgresados, actualizarEgresadoAdmin } from "../controllers/userController.js";

const router = express.Router();

// Sólo las usa el panel de administración: sesión de administrador activa.
const sesionAdmin = [authMiddleware, requireRol("admin")];

router.get('/admin/todos', sesionAdmin, obtenerTodosLosEgresados);
// eliminarEgresado sigue deshabilitado (los borrados del panel quedan para otra ronda)
router.delete('/:id', bloqueoTemporal);
router.put('/:id', sesionAdmin, actualizarEgresadoAdmin);

export default router;
