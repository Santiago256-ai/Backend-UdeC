import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRol } from "../middleware/requireRol.js";
import {
    crearVacante,
    listarVacantes,
    eliminarVacante,
    listarVacantesPorEmpresa,
    actualizarVacante,
    reactivarVacante,
    eliminarDefinitivamente,
    obtenerDashboardMetricasPro,
    listarTodasLasVacantesAdmin,
    obtenerEstadisticasAdmin
} from "../controllers/vacanteController.js";

const router = express.Router();

// Escritura (ronda "dueño", 2026-10): sesión de empresa; el controlador comprueba
// además que la vacante sea de esa empresa (ajena o inexistente: el mismo 404).
const sesionEmpresa = [authMiddleware, requireRol("empresa")];
// Panel de administración: sesión de administrador activa.
const sesionAdmin = [authMiddleware, requireRol("admin")];

// ==========================================
//   1. RUTAS FIJAS O ESPECÍFICAS (Prioridad)
// ==========================================

// 🟢 Crear vacante (POST /)
router.post("/", sesionEmpresa, crearVacante);

// 🟢 Listar todas las vacantes (GET /)
router.get("/", listarVacantes); 

// --- RUTAS DE ADMINISTRACIÓN GLOBAL ---
router.get("/admin/todas", sesionAdmin, listarTodasLasVacantesAdmin);
router.get("/stats", sesionAdmin, obtenerEstadisticasAdmin);


// ==========================================
//   2. RUTAS CON SUB-RUTAS DINÁMICAS
// ==========================================

// 📊 Dashboard de Métricas PRO (Debe ir antes de cualquier /:id general)
// Sólo la propia empresa: el controlador compara :id con el del token.
router.get("/empresa/:id/metricas-pro", sesionEmpresa, obtenerDashboardMetricasPro);

// ✅ Listar vacantes por ID de empresa
router.get("/empresa/:id", listarVacantesPorEmpresa);

// ♻️ Reactivar una vacante (Mover de Eliminadas a Activas)
router.put("/:id/reactivar", sesionEmpresa, reactivarVacante);

// 💀 Eliminar DEFINITIVAMENTE (Debe ir antes del DELETE /:id general)
router.delete("/:id/definitivo", sesionEmpresa, eliminarDefinitivamente);


// ==========================================
//   3. RUTAS DINÁMICAS GENERALES (Al Final)
// ==========================================

// 1. Métodos PUT generales
// 🔵 Actualizar vacante (Editar / Cambiar estado)
router.put("/:id", sesionEmpresa, actualizarVacante);

// 2. Métodos DELETE generales
// 🔴 Mover a la papelera (Borrado Lógico)
router.delete("/:id", sesionEmpresa, eliminarVacante);

export default router;