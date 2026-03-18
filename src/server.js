// server.js (Versión Unificada con Prisma y Firebase)

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import admin from "firebase-admin";
import { Buffer } from 'buffer'; 
import { PrismaClient } from "@prisma/client";

// ✅ Inicializamos Prisma de forma global
const prisma = new PrismaClient();

// Importación de Rutas (Corregidas según tu estructura de carpetas)
import authRoutes from "./routes/authRoutes.js"; 
import vacantesRoutes from "./routes/vacantesRoutes.js";
import postulacionesRoutes from "./routes/postulacionesRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";
import estudianteRoutes from "./routes/estudianteRoutes.js";
import mensajeriaRoutes from "./routes/mensajeriaRoutes.js"; 
import cvsRoutes from "./routes/cvsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// ----------------- CONFIGURACIÓN FIREBASE ADMIN -----------------
try {
    const base64Credentials = process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64;

    if (!base64Credentials) {
        throw new Error("ERROR CRÍTICO: FIREBASE_ADMIN_CREDENTIALS_BASE64 no está configurada.");
    }

    const decodedJson = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const firebaseCredentials = JSON.parse(decodedJson); 

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseCredentials),
        });
        console.log("✅ Firebase Admin inicializado");
    }
} catch (error) {
    console.error("❌ ERROR FIREBASE:", error.message);
    // En Vercel no siempre es recomendable usar process.exit(1), pero se mantiene por seguridad
}

// ----------------- CONFIGURACIÓN CORS -----------------
// En tu server.js (Backend)
const corsOptions = {
    // Agregamos todos los posibles orígenes (tu local y el de producción)
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000', 
        'https://frontend-ude-c.vercel.app' // Cambia esto por tu URL real de frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Muy importante para JWT
    credentials: true,
    optionsSuccessStatus: 200 // Vercel a veces prefiere 200 sobre 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// ----------------- MIDDLEWARES -----------------
app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "src", "uploads")));

// ----------------- RUTAS -----------------
app.get("/", (req, res) => {
    res.send("Backend UdeC API funcionando 🚀 (Prisma Client Activo)");
});

// Ruta de prueba unificada con Prisma
app.get("/users", async (req, res) => {
    try {
        const result = await prisma.usuario.findMany(); // Cambiado de pool.query a Prisma
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener usuarios desde Prisma");
    }
});

// Rutas API (Asegúrate de que el Frontend use el prefijo /api)
app.use("/api/auth", authRoutes); 
app.use("/api/vacantes", vacantesRoutes);
app.use("/api/postulaciones", postulacionesRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/mensajeria", mensajeriaRoutes); 
app.use("/api/cvs", cvsRoutes);
app.use("/api/usuarios", userRoutes);

// ----------------- INICIALIZACIÓN -----------------
const PORT = process.env.PORT || 8080;

async function checkDatabaseConnection() {
    console.log("⏳ Probando conexión con Prisma...");
    try {
        await prisma.$connect();
        console.log("✅ Conexión a PostgreSQL (vía Prisma) establecida.");
        return true;
    } catch (error) {
        console.error("❌ ERROR CRÍTICO DB:", error.message);
        return false;
    }
}


// ✅ OBLIGATORIO PARA VERCEL:
export default app;