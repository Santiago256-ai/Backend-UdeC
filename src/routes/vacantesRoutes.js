import express from "express";
import { 
    crearVacante, 
    listarVacantes, 
    eliminarVacante, 
    listarVacantesPorEmpresa,
    // obtenerVacantePorId // 👈 Agrégalo cuando crees la función en el controller
} from "../controllers/vacanteController.js"; 

const router = express.Router();

// 🟢 Crear vacante
router.post("/", crearVacante); 

// 🟢 Listar TODAS las vacantes
router.get("/", listarVacantes); 

// ✅ Listar vacantes por ID de empresa
router.get("/empresa/:id", listarVacantesPorEmpresa);

// 🔴 Eliminar vacante
router.delete("/:id", eliminarVacante);
router.get("/admin/todas", listarTodasLasVacantesAdmin); // Nueva ruta

//Control del administrador
router.get("/stats", obtenerEstadisticasAdmin)

export default router;