import express from "express";
import multer from "multer";
import { 
    crearPostulacion, 
    obtenerPostulacionesPorVacante,
    actualizarEstadoPostulacion,
    obtenerDetallePostulacionesAdmin,
    obtenerTodasLasPostulacionesAdmin
} from "../controllers/postulacionController.js"; 

const router = express.Router();

// ✅ CORRECCIÓN PARA VERCEL: Usar memoria en lugar de disco
// Esto evita intentar escribir en '/var/task/src/uploads/', que está bloqueado
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // Límite de 5MB para evitar sobrecargar la memoria
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Solo se permiten archivos PDF"), false);
    }
    cb(null, true);
  },
});

// --- RUTAS DE POSTULACIÓN ---

// 1. GET: Obtener postulaciones por ID de Vacante
router.get("/vacante/:vacanteId", obtenerPostulacionesPorVacante);

router.post("/enviar", crearPostulacion);

// 3. PATCH: Actualizar el estado de una postulación
router.patch("/:id/estado", actualizarEstadoPostulacion);

//Perfil administrador
router.get("/admin/detalle-completo/:vacanteId", obtenerDetallePostulacionesAdmin);
router.get("/admin/todas", obtenerTodasLasPostulacionesAdmin);

export default router;