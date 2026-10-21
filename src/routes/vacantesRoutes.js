import express from "express";
import { bloqueoTemporal } from "../middleware/bloqueoTemporal.js";
import {
    crearVacante,
    listarVacantes,
    eliminarVacante,
    listarVacantesPorEmpresa,
    actualizarVacante,
    reactivarVacante,
    eliminarDefinitivamente,
    obtenerDashboardMetricasPro
} from "../controllers/vacanteController.js";

const router = express.Router();

// ==========================================
//   1. RUTAS FIJAS O ESPECÍFICAS (Prioridad)
// ==========================================

// 🟢 Crear vacante (POST /)
router.post("/", crearVacante); 

// 🟢 Listar todas las vacantes (GET /)
router.get("/", listarVacantes); 

// --- RUTAS DE ADMINISTRACIÓN GLOBAL ---
// listarTodasLasVacantesAdmin y obtenerEstadisticasAdmin, hasta que exista el rol
// de administrador
router.get("/admin/todas", bloqueoTemporal);
router.get("/stats", bloqueoTemporal);


// ==========================================
//   2. RUTAS CON SUB-RUTAS DINÁMICAS
// ==========================================

// 📊 Dashboard de Métricas PRO (Debe ir antes de cualquier /:id general)
router.get("/empresa/:id/metricas-pro", obtenerDashboardMetricasPro);

// ✅ Listar vacantes por ID de empresa
router.get("/empresa/:id", listarVacantesPorEmpresa);

// ♻️ Reactivar una vacante (Mover de Eliminadas a Activas)
router.put("/:id/reactivar", reactivarVacante);

// 💀 Eliminar DEFINITIVAMENTE (Debe ir antes del DELETE /:id general)
router.delete("/:id/definitivo", eliminarDefinitivamente);


// ==========================================
//   3. RUTAS DINÁMICAS GENERALES (Al Final)
// ==========================================

// 1. Métodos PUT generales
// 🔵 Actualizar vacante (Editar / Cambiar estado)
router.put("/:id", actualizarVacante); 

// 2. Métodos DELETE generales
// 🔴 Mover a la papelera (Borrado Lógico)
router.delete("/:id", eliminarVacante);

export default router;