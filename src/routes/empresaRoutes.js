import { Router } from "express";
import { 
    crearEmpresa, 
    listarEmpresas, 
    loginEmpresa,
    obtenerEmpresasParaAdmin,
    eliminarEmpresaAdmin 
} from "../controllers/empresaController.js";

const router = Router();

// Crear empresa (POST /api/empresas)
// ✅ CORREGIDO: La ruta ahora es solo "/"
router.post("/", crearEmpresa);

// Listar empresas (GET /api/empresas)
// ✅ CORREGIDO: La ruta ahora es solo "/"
router.get("/", listarEmpresas);

// 🔐 RUTA DE LOGIN (POST /api/empresas/login)
// ✅ CORREGIDO: La ruta ahora es solo "/login"
router.post("/login", loginEmpresa); 

// 🚀 NUEVO: Flujo exclusivo para el Administrador
router.get("/admin/todas", obtenerEmpresasParaAdmin);
router.delete("/admin/:id", eliminarEmpresaAdmin);

export default router;