import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js"; // 👈 Nombre exacto
import { bloqueoTemporal } from "../middleware/bloqueoTemporal.js";
import { requireRol } from "../middleware/requireRol.js";
import {
    crearEmpresa,
    listarEmpresas,
    obtenerPerfilEmpresa, // 👈 Agregar
    actualizarEmpresa,    // 👈 Agregar
    obtenerEmpresasParaAdmin,
    actualizarEstadoEmpresaAdmin,
    actualizarEmpresaAdmin
} from "../controllers/empresaController.js";

const router = Router();

// Panel de administración: sesión de administrador activa.
const sesionAdmin = [authMiddleware, requireRol("admin")];

router.post("/", crearEmpresa);
router.get("/", listarEmpresas);

// 🚀 NUEVAS RUTAS PARA EL PERFIL
// GET /api/empresas/:id -> Para cargar el perfil
router.get("/:id", authMiddleware, obtenerPerfilEmpresa); 
router.put("/:id", authMiddleware, actualizarEmpresa);

router.get("/admin/todas", sesionAdmin, obtenerEmpresasParaAdmin);
// eliminarEmpresaAdmin sigue deshabilitado (los borrados del panel quedan para otra ronda)
router.delete("/admin/:id", bloqueoTemporal);
router.put('/admin/estado/:id', sesionAdmin, actualizarEstadoEmpresaAdmin);
router.put('/admin/:id', sesionAdmin, actualizarEmpresaAdmin);

export default router;