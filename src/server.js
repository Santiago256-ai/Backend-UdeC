// server.js modificado (con Singleton Fix para Firebase)

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

// 🛑 DIAGNÓSTICO: COMENTADO para saltar la inicialización de la BBDD
// import pool from "./database.js"; 

const app = express();

// ----------------- CONFIGURACIÓN FIREBASE ADMIN (Aplicando Singleton Fix) -----------------

try {
    // === FIX CRÍTICO 1: Eliminar la variable de entorno por defecto ===
    // Previene que el SDK de Firebase la busque y lance el error antiguo.
    if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
        console.warn("⚠️ ADVERTENCIA: Eliminando la variable antigua FIREBASE_ADMIN_CREDENTIALS del runtime.");
        delete process.env.FIREBASE_ADMIN_CREDENTIALS;
    }

    const base64Credentials = process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64;

    if (!base64Credentials) {
        throw new Error("ERROR CRÍTICO: La variable FIREBASE_ADMIN_CREDENTIALS_BASE64 NO ESTÁ CONFIGURADA.");
    }

    // 1. Decodificar y Parsear (Esto requiere que la Base64 sea la correcta)
    const decodedJson = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const firebaseCredentials = JSON.parse(decodedJson); 

    // ✅ FIX CRÍTICO 2: Aplicar el Singleton Pattern para evitar el error "already exists"
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseCredentials),
        });
        console.log("✅ Firebase Admin inicializado correctamente");
    } else {
         // Si ya está inicializada por otro archivo (como indican tus logs), la reutilizamos
        admin.app(); 
        console.log("✅ Firebase Admin ya estaba inicializado. Reutilizando la aplicación.");
    }

} catch (error) {
    // Si falla la inicialización, registramos el error CLARAMENTE y forzamos el fin
    console.error("❌ ERROR FATAL DE INICIALIZACIÓN DE FIREBASE:", error.message);
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