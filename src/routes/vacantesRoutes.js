import express from "express";
import { 
    crearVacante, 
    listarVacantes, 
    eliminarVacante, 
    listarVacantesPorEmpresa,
    listarTodasLasVacantesAdmin,
    obtenerEstadisticasAdmin,
    actualizarVacante,
    reactivarVacante,          // 🆕 Nueva importación
    eliminarDefinitivamente    // 🆕 Nueva importación
} from "../controllers/vacanteController.js";

const router = express.Router();

// --- RUTAS PÚBLICAS / GENERALES ---

// 🟢 Crear vacante
router.post("/", crearVacante); 

// 🟢 Listar TODAS las vacantes (Para el feed de egresados - solo ABIERTAS)
router.get("/", listarVacantes); 


// --- RUTAS DE GESTIÓN (Empresa) ---

// 🔵 Actualizar vacante (Editar)
router.put("/:id", actualizarVacante); 

// ✅ Listar vacantes por ID de empresa (Soportará filtros por estado via Query Params)
router.get("/empresa/:id", listarVacantesPorEmpresa);

// ♻️ Reactivar una vacante (Mover de Eliminadas a Activas)
router.put("/:id/reactivar", reactivarVacante);

// 🔴 Mover a la papelera (Borrado Lógico - Cambia estado a "ELIMINADA")
router.delete("/:id", eliminarVacante);

// 💀 Eliminar DEFINITIVAMENTE (Borrado físico de la base de datos)
router.delete("/:id/definitivo", eliminarDefinitivamente);


// --- RUTAS DE ADMINISTRACIÓN ---

router.get("/admin/todas", listarTodasLasVacantesAdmin);
router.get("/stats", obtenerEstadisticasAdmin);

export default router;