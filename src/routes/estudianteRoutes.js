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
        const uId = parseInt(req.params.usuarioId);
        const postulaciones = await prisma.postulacion.findMany({
            where: { egresadoId: uId }, // ✅ CAMBIAR 'usuarioId' por 'egresadoId'
            include: { vacante: true },
        });
        res.json(postulaciones);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener postulaciones" });
    }
});

// 2. Postularse a una vacante
// 2. Postularse a una vacante
router.post("/:vacanteId/postular", authMiddleware, async (req, res) => {
    try {
        const { telefono } = req.body;
        const vId = parseInt(req.params.vacanteId);
        
        // Usamos uId para no confundirnos, viene del token (authMiddleware)
        const uId = parseInt(req.user.id); 

        if (isNaN(vId) || isNaN(uId)) {
            return res.status(400).json({ error: "ID de vacante o usuario inválido" });
        }

        // 1. Buscamos el perfil usando el nombre correcto: egresadoId
        // Cambiamos 'id' por 'uId' que es la variable definida arriba
        const perfil = await prisma.perfilCV.findUnique({
            where: { egresadoId: uId } 
        });

        // 2. Creamos la postulación con los nombres exactos de tu MODELO
        const postulacion = await prisma.postulacion.create({
            data: {
                vacanteId: vId,
                egresadoId: uId, // ✅ Coincide con tu Schema
                // En PerfilCV el campo es 'celular', no 'telefono'
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