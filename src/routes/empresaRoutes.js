import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js"; // 👈 Nombre exacto
import { 
    crearEmpresa, 
    listarEmpresas, 
    obtenerEmpresasParaAdmin,
    eliminarEmpresaAdmin,
    obtenerPerfilEmpresa, // 👈 Agregar
    actualizarEmpresa,    // 👈 Agregar
    actualizarEstadoEmpresaAdmin,
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
router.delete("/admin/:id", eliminarEmpresaAdmin);
router.put('/admin/estado/:id', actualizarEstadoEmpresaAdmin);
router.put('/admin/:id', actualizarEmpresaAdmin);

export default router;