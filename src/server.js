// server.js (Base de Datos Habilitada y FIXES Finales)

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import admin from "firebase-admin";

// Importamos Buffer
import { Buffer } from 'buffer'; 

// ✅ BASE DE DATOS HABILITADA: Descomentamos la importación del pool
import pool from "./database.js"; 

import vacanteRoutes from "./routes/vacanteRoutes.js";
import postulacionRoutes from "./routes/postulacionRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";
import estudianteRoutes from "./routes/estudianteRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 

// ⚡ NUEVA RUTA: Importamos la ruta de mensajería ⚡
import mensajesRoutes from "./routes/mensajesRoutes.js"; 

const app = express();

// ----------------- CONFIGURACIÓN FIREBASE ADMIN (FIXED & REUSABLE) -----------------

try {
    // Si la inicialización de Firebase está siendo manejada en otro archivo que importa
    // esta configuración, se debe mantener solo el chequeo y la reutilización. 
    // Mantenemos la lógica de Base64 en el server.js por seguridad.
    
    if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
        delete process.env.FIREBASE_ADMIN_CREDENTIALS;
    }

    const base64Credentials = process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64;

    if (!base64Credentials) {
        throw new Error("ERROR CRÍTICO: La variable FIREBASE_ADMIN_CREDENTIALS_BASE64 NO ESTÁ CONFIGURADA.");
    }

    const decodedJson = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const firebaseCredentials = JSON.parse(decodedJson); 

    // Aplicar Singleton Fix para evitar el error "already exists"
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseCredentials),
        });
        console.log("✅ Firebase Admin inicializado correctamente");
    } else {
        admin.app(); 
        console.log("✅ Firebase Admin ya estaba inicializado. Reutilizando la aplicación.");
    }

} catch (error) {
    console.error("❌ ERROR FATAL DE INICIALIZACIÓN DE FIREBASE:", error.message);
    process.exit(1); 
}

// ---------------------------------------------------------------
// ----------------- CONFIGURACIÓN CORS -----------------

const corsOptions = {
    origin: ['https://frontend-ude-c.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// ---------------------------------------------------------------
// ----------------- MIDDLEWARES -----------------

app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "src", "uploads")));

// ---------------------------------------------------------------
// ----------------- RUTAS -----------------

app.get("/", (req, res) => {
    res.send("Backend UdeC API funcionando 🚀 (Conexión a DB activa)");
});

// Ruta de prueba de BBDD
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor o BBDD");
    }
});


// Rutas API
app.use("/api/auth", authRoutes); 
app.use("/api/vacantes", vacanteRoutes);
app.use("/api/postulaciones", postulacionRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/estudiantes", estudianteRoutes);
// ⚡ CONEXIÓN DE LA NUEVA RUTA DE MENSAJES ⚡
app.use("/api/mensajes", mensajesRoutes); 

// ---------------------------------------------------------------
// ----------------- TEST DE BASE DE DATOS E INICIALIZAR SERVIDOR -----------------

const PORT = process.env.PORT || 8080;

async function checkDatabaseConnection() {
    console.log("⏳ Probando conexión a la Base de Datos...");
    try {
        const client = await pool.connect();
        await client.query('SELECT 1'); 
        client.release();
        console.log("✅ Conexión a PostgreSQL establecida correctamente.");
        return true;
    } catch (error) {
        console.error("❌ ERROR CRÍTICO: No se pudo conectar a PostgreSQL.", error.message);
        console.error(`DB URL: ${process.env.DATABASE_URL ? "Configurada" : "NO configurada"}`);
        console.error("⚠️ El servidor continuará ejecutándose, pero las rutas que usan la DB fallarán.");
        return false;
    }
}

// Ejecutar la prueba y luego iniciar el servidor
checkDatabaseConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
});

// ✅ OBLIGATORIO PARA VERCEL:
export default app;