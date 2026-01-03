import { Router } from "express";
import multer from "multer";
import { createClient } from '@supabase/supabase-js'; // Importamos el cliente de Supabase
import prisma from "../prismaClient.js"; 
import { crearEstudiante, loginEstudiante } from "../controllers/estudianteController.js"; 

const router = Router();

// 1. Configuración de Supabase
// Estas variables ya deben estar configuradas en tu panel de Vercel
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON_KEY
);

// 2. Configuración de multer en MEMORIA
// Esto evita intentar escribir en el disco duro bloqueado de Vercel
const storage = multer.memoryStorage(); 

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Solo se permiten archivos PDF"));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por archivo
});

// 🛣️ RUTAS DE AUTENTICACIÓN
router.post("/registro", crearEstudiante);
router.post("/login", loginEstudiante); 

// GET: Obtener postulaciones de un usuario
router.get("/usuario/:usuarioId", async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const postulaciones = await prisma.postulacion.findMany({
            where: { usuarioId },
            include: { vacante: true },
        });
        res.json(postulaciones);
    } catch (error) {
        console.error("Error al obtener postulaciones:", error);
        res.status(500).json({ error: "Error interno al obtener postulaciones" });
    }
});

// POST: Subir CV a Supabase y registrar en Base de Datos
router.post("/:vacanteId/upload", upload.single("cv"), async (req, res) => {
    try {
        const vacanteId = parseInt(req.params.vacanteId);
        const { usuarioId, telefono } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "No se seleccionó ningún archivo PDF" });
        }

        // Generamos un nombre único para evitar que archivos se sobrescriban
        const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;

        // A. Subimos el archivo directamente a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('hojas_de_vida') // Asegúrate de que este nombre coincida con tu bucket
            .upload(fileName, req.file.buffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            console.error("Error al subir a Supabase:", uploadError);
            return res.status(500).json({ error: "Error al subir archivo a la nube" });
        }

        // B. Obtenemos la URL pública del archivo (Gracias a tus políticas SELECT)
        const { data: { publicUrl } } = supabase.storage
            .from('hojas_de_vida')
            .getPublicUrl(fileName);

        // C. Guardamos la postulación en Prisma usando la URL pública
        const postulacion = await prisma.postulacion.create({
            data: {
                vacanteId,
                usuarioId: parseInt(usuarioId),
                telefono,
                cv_url: publicUrl, // Aquí guardamos el link directo, no el nombre del archivo
            },
        });

        res.json({ 
            message: "CV subido y postulación registrada exitosamente", 
            postulacion,
            url: publicUrl 
        });

    } catch (error) {
        console.error("Error completo en la postulación:", error);
        res.status(500).json({ error: "Error interno al procesar la subida del CV" });
    }
});

export default router;