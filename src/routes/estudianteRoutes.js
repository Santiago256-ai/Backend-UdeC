import { Router } from "express";
import multer from "multer";
import { createClient } from '@supabase/supabase-js'; 
import prisma from "../prismaClient.js"; 
import { crearEstudiante, loginEstudiante } from "../controllers/estudianteController.js"; 

const router = Router();

// 1. Inicialización de Supabase con variables de entorno de Vercel
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON_KEY
);

// 2. Configuración de Multer: USAR MEMORIA (Crucial para Vercel)
// Esto evita el error EROFS al no intentar escribir en el disco del servidor
const storage = multer.memoryStorage(); 

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Máximo 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Solo se permiten archivos PDF"), false);
        }
    }
});

// RUTAS EXISTENTES
router.post("/registro", crearEstudiante);
router.post("/login", loginEstudiante); 

// Obtener postulaciones por usuario
router.get("/usuario/:usuarioId", async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const postulaciones = await prisma.postulacion.findMany({
            where: { usuarioId },
            include: { vacante: true },
        });
        res.json(postulaciones);
    } catch (error) {
        console.error("Error en GET postulaciones:", error);
        res.status(500).json({ error: "Error al obtener postulaciones" });
    }
});

// 3. RUTA DE CARGA DE CV (CORREGIDA PARA LA NUBE)
router.post("/:vacanteId/upload", upload.single("cv"), async (req, res) => {
    try {
        const { usuarioId, telefono } = req.body;
        const vacanteId = parseInt(req.params.vacanteId);

        if (!req.file) {
            return res.status(400).json({ error: "Debe subir un archivo PDF" });
        }

        // Crear un nombre único para el archivo en la nube
        const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;

        // SUBIDA A SUPABASE STORAGE
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('hojas_de_vida') // Nombre del bucket que creaste
            .upload(fileName, req.file.buffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            console.error("Error subiendo a Supabase:", uploadError);
            throw uploadError;
        }

        // OBTENER LA URL PÚBLICA (Gracias a tu política SELECT)
        const { data: { publicUrl } } = supabase.storage
            .from('hojas_de_vida')
            .getPublicUrl(fileName);

        // GUARDAR EN POSTGRESQL (A través de Prisma)
        const postulacion = await prisma.postulacion.create({
            data: {
                vacanteId,
                usuarioId: parseInt(usuarioId),
                telefono,
                cv_url: publicUrl, // Guardamos el link de la nube, no una ruta local
            },
        });

        res.json({ 
            message: "¡Postulación exitosa!", 
            postulacion,
            fileUrl: publicUrl 
        });

    } catch (error) {
        console.error("Error detallado en la carga:", error);
        res.status(500).json({ 
            error: "Error interno al procesar el CV",
            details: error.message 
        });
    }
});

export default router;