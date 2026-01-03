import { Router } from "express";
import multer from "multer";
import prisma from "../prismaClient.js"; // ⬅️ IMPORTANTE
import { crearEstudiante, loginEstudiante } from "../controllers/estudianteController.js"; 

const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

router.post("/registro", crearEstudiante);
router.post("/login", loginEstudiante); 

router.get("/usuario/:usuarioId", async (req, res) => {
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

router.post("/:vacanteId/upload", upload.single("cv"), async (req, res) => {
    try {
        const { usuarioId, telefono } = req.body;
        const postulacion = await prisma.postulacion.create({
            data: {
                vacanteId: parseInt(req.params.vacanteId),
                usuarioId: parseInt(usuarioId),
                telefono,
                cv_url: req.file ? req.file.filename : null,
            },
        });
        res.json({ message: "CV subido", postulacion });
    } catch (error) {
        res.status(500).json({ error: "Error al subir CV" });
    }
});

export default router;