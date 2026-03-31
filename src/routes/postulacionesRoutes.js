import express from "express";
import multer from "multer";
import { 
    crearPostulacion, 
    obtenerPostulacionesPorVacante,
    actualizarEstadoPostulacion,
    actualizarAnclajePostulacion, // 1. IMPORTA LA NUEVA FUNCIÓN
    obtenerDetallePostulacionesAdmin,
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

// --- RUTAS DE POSTULACIÓN ---

router.get("/vacante/:vacanteId", obtenerPostulacionesPorVacante);
router.post("/enviar", crearPostulacion);

// 2. NUEVA RUTA: Actualizar solo el anclaje
router.put("/:id/anclaje", actualizarAnclajePostulacion); 

// 3. PUT: Actualizar el estado de una postulación
router.put("/:id/estado", actualizarEstadoPostulacion);

// Perfil administrador
router.get("/admin/detalle-completo/:vacanteId", obtenerDetallePostulacionesAdmin);
router.get("/admin/todas", obtenerTodasLasPostulacionesAdmin);

export default router;