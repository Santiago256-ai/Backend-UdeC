import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRol } from "../middleware/requireRol.js";
import {
    crearPostulacion,
    obtenerPostulacionesPorVacante,
    actualizarEstadoPostulacion,
    actualizarAnclajePostulacion,
    // --- NUEVAS IMPORTACIONES ---
    obtenerPostulacionesPorEmpresa, 
    calificarPostulacion,
    // ----------------------------
    obtenerTodasLasPostulacionesAdmin
} from "../controllers/postulacionController.js"; 

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Solo se permiten archivos PDF"), false);
    }
    cb(null, true);
  },
});

// --- RUTAS DE POSTULACIÓN (EGRESADOS Y EMPRESAS) ---

// Sólo la empresa dueña de la vacante (token + verificación en el controlador)
router.get("/vacante/:vacanteId", authMiddleware, obtenerPostulacionesPorVacante);
// Sólo una sesión de egresado, que se postula a sí misma (el egresado sale del token)
router.post("/enviar", authMiddleware, requireRol("egresado"), crearPostulacion);

// --- RUTAS DE GESTIÓN (DASHBOARD EMPRESA) ---

// Obtiene todas las postulaciones de una empresa específica (Para la nueva tabla global)
// Sólo la propia empresa (token + verificación en el controlador)
router.get("/empresa/:empresaId", authMiddleware, obtenerPostulacionesPorEmpresa);

// Actualizar el estado de una postulación
// Sólo la empresa dueña de la vacante (token + verificación en el controlador)
router.put("/:id/estado", authMiddleware, actualizarEstadoPostulacion);

// Actualizar solo el anclaje (favoritos)
router.put("/:id/anclaje", authMiddleware, actualizarAnclajePostulacion); 

// Nueva ruta para que la empresa califique al egresado (Seguimiento Admin)
router.put("/calificar/:id", authMiddleware, calificarPostulacion);

// --- PERFIL ADMINISTRADOR (UdeC) ---
// Sesión de administrador activa.
router.get("/admin/todas", authMiddleware, requireRol("admin"), obtenerTodasLasPostulacionesAdmin);

export default router;