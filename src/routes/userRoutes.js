// backend/routes/userRoutes.js
import express from "express";
import { obtenerTodosLosEgresados, actualizarEgresadoAdmin } from '../controllers/userController.js';
import { bloqueoTemporal } from '../middleware/bloqueoTemporal.js';

const router = express.Router();

router.get('/admin/todos', obtenerTodosLosEgresados);
router.delete('/:id', bloqueoTemporal); // eliminarEgresado, hasta que exista el rol de administrador
router.put('/:id', actualizarEgresadoAdmin);

export default router;