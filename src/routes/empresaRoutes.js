import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js"; // 👈 Nombre exacto
import { bloqueoTemporal } from "../middleware/bloqueoTemporal.js";
import {
    crearEmpresa,
    listarEmpresas,
    obtenerPerfilEmpresa, // 👈 Agregar
    actualizarEmpresa     // 👈 Agregar
} from "../controllers/empresaController.js";

const router = Router();

router.post("/", crearEmpresa);
router.get("/", listarEmpresas);

// 🚀 NUEVAS RUTAS PARA EL PERFIL
// GET /api/empresas/:id -> Para cargar el perfil
router.get("/:id", authMiddleware, obtenerPerfilEmpresa); 
router.put("/:id", authMiddleware, actualizarEmpresa);

// obtenerEmpresasParaAdmin, eliminarEmpresaAdmin, actualizarEstadoEmpresaAdmin y
// actualizarEmpresaAdmin, hasta que exista el rol de administrador
router.get("/admin/todas", bloqueoTemporal);
router.delete("/admin/:id", bloqueoTemporal);
router.put('/admin/estado/:id', bloqueoTemporal);
router.put('/admin/:id', bloqueoTemporal);

export default router;