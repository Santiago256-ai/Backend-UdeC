// backend/routes/userRoutes.js
import express from "express";
import { obtenerTodosLosUsuarios, eliminarUsuario } from "../controllers/userController.js";

const router = express.Router();

// Ruta para que el Admin vea a todos los usuarios (Egresados)
router.get("/admin/todos", obtenerTodosLosUsuarios);

// Ruta para eliminar un usuario por ID
router.delete("/:id", eliminarUsuario);

export default router;