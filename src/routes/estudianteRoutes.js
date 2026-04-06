import { Router } from "express";
import prisma from "../prismaClient.js"; 
import { 
    crearEstudiante, 
    loginEstudiante, 
    guardarCV, 
    obtenerMiCV,
    obtenerPerfilBase,    // 👈 Nueva importación: Lee datos de registro
    actualizarEgresado    // 👈 Nueva importación: Actualiza datos de registro
} from "../controllers/estudianteController.js"; 
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// --- RUTAS DE AUTENTICACIÓN ---
router.post("/registro", crearEstudiante);
router.post("/login", loginEstudiante); 

// --- RUTAS DE PERFIL BASE (DATOS DE REGISTRO) ---
// Estas rutas sirven para el componente PerfilEgresado.jsx

// 1. Obtener datos (Nombre, Apellidos, Facultad, Programa, Celular)
router.get("/perfil", authMiddleware, obtenerPerfilBase);

// 2. Actualizar esos mismos datos
router.put("/actualizar", authMiddleware, actualizarEgresado);


// --- RUTAS DE LA HOJA DE VIDA DIGITAL ---
// Estas rutas son exclusivamente para la Hoja de Vida (CV)
router.get("/mi-cv", authMiddleware, obtenerMiCV);
router.post("/guardar-cv", authMiddleware, guardarCV);


// --- RUTAS DE POSTULACIÓN ---

// 1. Ver mis postulaciones
router.get("/usuario/:usuarioId", authMiddleware, async (req, res) => {
    try {
        const uId = parseInt(req.params.usuarioId);
        const postulaciones = await prisma.postulacion.findMany({
            where: { egresadoId: uId },
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
        const vId = parseInt(req.params.vacanteId);
        const uId = parseInt(req.user.id); 

        if (isNaN(vId) || isNaN(uId)) {
            return res.status(400).json({ error: "ID de vacante o usuario inválido" });
        }

        const perfil = await prisma.perfilCV.findUnique({
            where: { egresadoId: uId } 
        });

        const postulacion = await prisma.postulacion.create({
            data: {
                vacanteId: vId,
                egresadoId: uId,
                telefono: telefono || perfil?.celular || "Sin teléfono", 
                estado: "PENDIENTE"
            },
        });

        res.json({ message: "¡Postulación exitosa!", postulacion });
    } catch (error) {
        console.error("ERROR EN POSTULACIÓN:", error.message);
        res.status(500).json({ 
            error: "Error al procesar la postulación", 
            detalle: error.message 
        });
    }
});

export default router;