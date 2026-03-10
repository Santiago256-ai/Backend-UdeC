import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import vacantesRoutes from "./routes/vacantesRoutes.js";
import cvsRoutes from "./routes/cvsRoutes.js";
import postulacionesRoutes from "./routes/postulacionesRoutes.js";
// 1. IMPORTA LAS RUTAS DE MENSAJERÍA AQUÍ
import mensajeriaRoutes from "./routes/mensajeriaRoutes.js"; 

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// 2. CONFIGURACIÓN DE CORS MÁS SEGURA
app.use(cors({
    origin: ["http://localhost:5173", "https://frontend-ude-c.vercel.app"], // Añade tu URL de producción
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// RUTAS
app.use("/auth", authRoutes);
app.use("/vacantes", vacantesRoutes);
app.use("/cvs", cvsRoutes);
app.use("/postulaciones", postulacionesRoutes);
// 3. REGISTRA LA RUTA AQUÍ (Esto quita el error 404)
app.use("/mensajeria", mensajeriaRoutes); 

// Middleware para capturar errores 404 globales
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada en el backend" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));