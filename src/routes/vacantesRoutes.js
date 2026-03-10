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

// 🔍 Obtener UNA sola vacante por su ID (Muy útil para ver detalles o iniciar chats)
// router.get("/:id", obtenerVacantePorId); 

// 🔴 Eliminar vacante
router.delete("/:id", eliminarVacante);

export default router;