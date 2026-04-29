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
// 2. Postularse a una vacante (VERSIÓN ACTUALIZADA CON NOTIFICACIONES)
router.post("/:vacanteId/postular", authMiddleware, async (req, res) => {
    try {
        const { telefono } = req.body;
        const vId = parseInt(req.params.vacanteId);
        const uId = parseInt(req.user.id); 

        if (isNaN(vId) || isNaN(uId)) {
            return res.status(400).json({ error: "ID de vacante o usuario inválido" });
        }

        // 1. Verificar vacante y obtener el empresaId para saber a quién notificar
        const vacante = await prisma.vacante.findUnique({
            where: { id: vId },
            select: { titulo: true, estado: true, empresaId: true }
        });

        if (!vacante) return res.status(404).json({ error: "La vacante no existe." });
        if (vacante.estado === "CERRADA") return res.status(400).json({ error: "Esta vacante ya no acepta postulaciones." });

        // 2. Verificar si ya está postulado para evitar duplicados
        const yaPostulado = await prisma.postulacion.findUnique({
            where: { vacanteId_egresadoId: { vacanteId: vId, egresadoId: uId } }
        });

        if (yaPostulado) {
            return res.status(400).json({ error: "Ya te has postulado a esta vacante anteriormente." });
        }

        // 3. Obtener el perfil para el celular de respaldo
        const perfil = await prisma.perfilCV.findUnique({
            where: { egresadoId: uId } 
        });

        // 4. Crear Postulación
        const postulacion = await prisma.postulacion.create({
            data: {
                vacanteId: vId,
                egresadoId: uId,
                telefono: telefono || perfil?.celular || "Sin teléfono", 
                estado: "PENDIENTE"
            },
            include: { 
                egresado: { select: { nombres: true } } // Necesitamos el nombre para la notificación
            }
        });

        // 🔔 5. CREAR NOTIFICACIÓN PARA LA EMPRESA
        await prisma.notificacion.create({
            data: {
                tipo: 'POSTULACION',
                contenido: `${postulacion.egresado.nombres} se ha postulado a tu vacante: "${vacante.titulo}"`,
                empresaId: vacante.empresaId, // 👈 Destino: la empresa dueña
                egresadoId: uId,             // 👈 Origen: el egresado
                referenciaId: vId,           // ID de la vacante
                postulacionId: postulacion.id,
                vista: false,
                fecha: new Date()
            }
        });

        // 6. Respondemos exactamente lo que el frontend espera
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