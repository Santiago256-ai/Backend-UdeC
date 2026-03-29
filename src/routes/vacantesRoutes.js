import express from "express";
import { 
    crearVacante, 
    listarVacantes, 
    eliminarVacante, 
    listarVacantesPorEmpresa,
    listarTodasLasVacantesAdmin,
    obtenerEstadisticasAdmin,
    actualizarVacante // 👈 1. AGREGA ESTA IMPORTACIÓN
} from "../controllers/vacanteController.js";

const router = express.Router();

// 🟢 Crear vacante
router.post("/", crearVacante); 

// 🟢 Listar TODAS las vacantes
router.get("/", listarVacantes); 

// 🔵 Actualizar vacante (Editar)
router.put("/:id", actualizarVacante); // 👈 2. AGREGA ESTA LÍNEA EXACTAMENTE AQUÍ

// ✅ Listar vacantes por ID de empresa
router.get("/empresa/:id", listarVacantesPorEmpresa);

// 🔴 Eliminar vacante
router.delete("/:id", eliminarVacante);

// --- Rutas de Administración ---
router.get("/admin/todas", listarTodasLasVacantesAdmin);
router.get("/stats", obtenerEstadisticasAdmin);

export default router;