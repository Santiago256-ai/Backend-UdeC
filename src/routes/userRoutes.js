// backend/routes/userRoutes.js
import express from "express";
import { obtenerTodosLosEgresados, eliminarEgresado, actualizarEgresadoAdmin } from '../controllers/userController.js';

const router = express.Router();

router.get('/admin/todos', obtenerTodosLosEgresados);
router.delete('/:id', eliminarEgresado);
router.put('/:id', actualizarEgresadoAdmin);

export default router;