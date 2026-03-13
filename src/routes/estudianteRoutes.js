import { Router } from "express";
import prisma from "../prismaClient.js"; 
import { 
    crearEstudiante, 
    loginEstudiante, 
    guardarCV, 
    obtenerMiCV 
} from "../controllers/estudianteController.js"; 
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// --- RUTAS DE AUTENTICACIÓN ---
router.post("/registro", crearEstudiante);
router.post("/login", loginEstudiante); 

// --- RUTAS DE LA HOJA DE VIDA DIGITAL ---
// Obtener los datos para cargar el formulario (useEffect)
router.get("/mi-cv", authMiddleware, obtenerMiCV);

// Guardar los datos del formulario (botón GUARDAR)
router.post("/guardar-cv", authMiddleware, guardarCV);

// --- RUTAS DE POSTULACIÓN ---

// 1. Ver mis postulaciones
router.get("/usuario/:usuarioId", authMiddleware, async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const postulaciones = await prisma.postulacion.findMany({
            where: { usuarioId },
            include: { vacante: true },
        });
        res.json(postulaciones);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener postulaciones" });
    }
});

// 2. Postularse a una vacante
router.post("/:vacanteId/postular", authMiddleware, async (req, res) => {
    try {
        const { telefono } = req.body;
        const vacanteId = parseInt(req.params.vacanteId);
        
        // FORZAMOS QUE SEA NÚMERO (si tu DB usa IDs numéricos)
        const usuarioId = parseInt(req.user.id); 

        if (isNaN(vacanteId) || isNaN(usuarioId)) {
            return res.status(400).json({ error: "ID de vacante o usuario inválido" });
        }

        const perfil = await prisma.perfilCV.findUnique({ where: { usuarioId } });
        if (!perfil) {
            return res.status(400).json({ error: "Primero debes crear tu hoja de vida digital" });
        }

        const postulacion = await prisma.postulacion.create({
            data: {
                vacanteId: vacanteId,
                usuarioId: usuarioId, // VERIFICA EN TU SCHEMA SI ES 'usuarioId' o 'estudianteId'
                telefono: telefono || perfil.telefono || "Sin teléfono",
                estado: "PENDIENTE"
            },
        });

        res.json({ message: "¡Postulación exitosa!", postulacion });
    } catch (error) {
        console.error("ERROR EN POSTULACIÓN:", error); // Esto te dará el detalle exacto en la consola de Vercel
        res.status(500).json({ error: "Error al procesar la postulación", detalle: error.message });
    }
});

export default router;