// server.js modificado (con diagnóstico de BBDD)

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import admin from "firebase-admin";

// Importamos Buffer para decodificar la cadena Base64, ya que es necesario en ESM
import { Buffer } from 'buffer'; 

import vacanteRoutes from "./routes/vacanteRoutes.js";
import postulacionRoutes from "./routes/postulacionRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";
import estudianteRoutes from "./routes/estudianteRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 

// 🛑 DIAGNÓSTICO: COMENTAR para saltar la inicialización de la BBDD
// import pool from "./database.js"; 

const app = express();

// ----------------- CONFIGURACIÓN FIREBASE ADMIN -----------------

try {
    // === INICIO DE DIAGNÓSTICO ===
    // ⚠️ Advertencia si la variable antigua todavía está presente
    if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
        console.warn("⚠️ ADVERTENCIA: La variable FIREBASE_ADMIN_CREDENTIALS todavía existe y debe ser eliminada.");
        // Opcionalmente, eliminarla en runtime para prevenir conflictos
        // delete process.env.FIREBASE_ADMIN_CREDENTIALS; 
    }
    // === FIN DE DIAGNÓSTICO ===

    const base64Credentials = process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64;

    if (!base64Credentials) {
        // ERROR CLARO: Si la variable Base64 no existe, lanzamos un error que no confunde.
        throw new Error("ERROR CRÍTICO: La variable FIREBASE_ADMIN_CREDENTIALS_BASE64 no está configurada en el entorno.");
    }

    // 1. Decodificar la cadena Base64 a una cadena JSON (utf8)
    const decodedJson = Buffer.from(base64Credentials, 'base64').toString('utf8');
    
    // 2. Parsear la cadena JSON decodificada
    const firebaseCredentials = JSON.parse(decodedJson); 

    admin.initializeApp({
        credential: admin.credential.cert(firebaseCredentials),
    });

    console.log("✅ Firebase Admin inicializado correctamente");
} catch (error) {
    // Si falla la inicialización, registramos el error CLARAMENTE
    console.error("❌ ERROR FATAL DE INICIALIZACIÓN DE FIREBASE:", error.message);
    
    // Terminamos el proceso para que Railway registre el error y no siga reiniciando
    process.exit(1); 
}

// ---------------------------------------------------------------
// ----------------- CONFIGURACIÓN CORS -----------------

const corsOptions = {
    // Tu frontend de Vercel está correctamente incluido aquí
    origin: ['https://frontend-ude-c.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // necesario si usas cookies o tokens
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// ---------------------------------------------------------------
// ----------------- MIDDLEWARES -----------------

app.use(express.json());

// Archivos estáticos (uploads)
// path.resolve() funciona bien en entornos de despliegue como Railway
app.use("/uploads", express.static(path.join(path.resolve(), "src", "uploads")));

// ---------------------------------------------------------------
// ----------------- RUTAS -----------------

app.get("/", (req, res) => {
    res.send("Backend UdeC API funcionando 🚀 (BBDD deshabilitada para diagnóstico)");
});

// 🛑 DIAGNÓSTICO: Ruta /users modificada para no usar pool
app.get("/users", async (req, res) => {
    // Nota: Si el backend arranca, esta ruta devolverá un 200 con un mensaje
    res.status(200).json({ message: "Ruta de usuarios bypass, BBDD deshabilitada para diagnóstico" });
});

// API Routes
app.use("/api/auth", authRoutes); 
app.use("/api/vacantes", vacanteRoutes);
app.use("/api/postulaciones", postulacionRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/estudiantes", estudianteRoutes);

// ---------------------------------------------------------------
// ----------------- INICIALIZAR SERVIDOR -----------------

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});