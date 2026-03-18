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

// vacanteRoutes.js
// ...
router.get("/admin/todas", listarTodasLasVacantesAdmin); // Nueva ruta
// ...

// 🔴 Eliminar vacante
router.delete("/:id", eliminarVacante);

export default router;