import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js"; // 👈 Nombre exacto
import { 
    crearEmpresa, 
    listarEmpresas, 
    loginEmpresa,
    obtenerEmpresasParaAdmin,
    eliminarEmpresaAdmin,
    obtenerPerfilEmpresa, // 👈 Agregar
    actualizarEmpresa    // 👈 Agregar
} from "../controllers/empresaController.js";

const router = Router();

router.post("/", crearEmpresa);
router.get("/", listarEmpresas);
router.post("/login", loginEmpresa); 

// 🚀 NUEVAS RUTAS PARA EL PERFIL
// GET /api/empresas/:id -> Para cargar el perfil
router.get("/:id", authMiddleware, obtenerPerfilEmpresa); 
router.put("/:id", authMiddleware, actualizarEmpresa);

router.get("/admin/todas", obtenerEmpresasParaAdmin);
router.delete("/admin/:id", eliminarEmpresaAdmin);

export default router;