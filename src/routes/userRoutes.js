// backend/routes/userRoutes.js
import express from "express";
import { obtenerTodosLosEgresados, eliminarEgresado } from '../controllers/userController.js';

const router = express.Router();

router.get('/admin/todos', obtenerTodosLosEgresados);
router.delete('/:id', eliminarEgresado);

export default router;