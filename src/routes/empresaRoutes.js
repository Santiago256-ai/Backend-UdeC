import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js"; // 👈 Nombre exacto
import { bloqueoTemporal } from "../middleware/bloqueoTemporal.js";
import {
    crearEmpresa,
    listarEmpresas,
    obtenerEmpresasParaAdmin,
    obtenerPerfilEmpresa, // 👈 Agregar
    actualizarEmpresa,    // 👈 Agregar
    actualizarEmpresaAdmin
} from "../controllers/empresaController.js";

const router = Router();

router.post("/", crearEmpresa);
router.get("/", listarEmpresas);

// 🚀 NUEVAS RUTAS PARA EL PERFIL
// GET /api/empresas/:id -> Para cargar el perfil
router.get("/:id", authMiddleware, obtenerPerfilEmpresa); 
router.put("/:id", authMiddleware, actualizarEmpresa);

router.get("/admin/todas", obtenerEmpresasParaAdmin);
// eliminarEmpresaAdmin y actualizarEstadoEmpresaAdmin, hasta que exista el rol de administrador
router.delete("/admin/:id", bloqueoTemporal);
router.put('/admin/estado/:id', bloqueoTemporal);
router.put('/admin/:id', actualizarEmpresaAdmin);

export default router;