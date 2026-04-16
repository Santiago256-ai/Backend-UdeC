import express from "express";
import multer from "multer";
import { 
    crearPostulacion, 
    obtenerPostulacionesPorVacante,
    actualizarEstadoPostulacion,
    actualizarAnclajePostulacion,
    obtenerDetallePostulacionesAdmin,
    obtenerTodasLasPostulacionesAdmin,
    // --- NUEVAS IMPORTACIONES ---
    obtenerPostulacionesPorEmpresa, 
    calificarPostulacion 
    // ----------------------------
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

router.get("/vacante/:vacanteId", obtenerPostulacionesPorVacante);
router.post("/enviar", crearPostulacion);

// --- RUTAS DE GESTIÓN (DASHBOARD EMPRESA) ---

// Obtiene todas las postulaciones de una empresa específica (Para la nueva tabla global)
router.get("/empresa/:empresaId", obtenerPostulacionesPorEmpresa); 

// Actualizar el estado de una postulación
router.put("/:id/estado", actualizarEstadoPostulacion);

// Actualizar solo el anclaje (favoritos)
router.put("/:id/anclaje", actualizarAnclajePostulacion); 

// Nueva ruta para que la empresa califique al egresado (Seguimiento Admin)
router.put("/calificar/:id", calificarPostulacion);

// --- PERFIL ADMINISTRADOR (UdeC) ---
router.get("/admin/detalle-completo/:vacanteId", obtenerDetallePostulacionesAdmin);
router.get("/admin/todas", obtenerTodasLasPostulacionesAdmin);

export default router;