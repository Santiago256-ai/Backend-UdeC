import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import vacanteRoutes from "./routes/vacanteRoutes.js";
import postulacionRoutes from "./routes/postulacionRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";
import estudianteRoutes from "./routes/estudianteRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 

import pool from "./database.js";

const app = express();

// --- CONFIGURACIÓN CORS CORREGIDA ---

// 1. Definir los orígenes permitidos
const allowedOrigins = [
    'https://frontend-ude-c.vercel.app', // Dominio de producción de tu Frontend
    'http://localhost:3000',             // Desarrollo (React/Vue/etc. común)
    'http://localhost:5173'              // Desarrollo (Vite común)
    // Agrega cualquier otro origen donde puedas probar tu Frontend
];

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir peticiones sin origen (ej. Postman, requests internos de Railway)
        if (!origin) return callback(null, true); 
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            // Origen de la lista blanca permitido
            callback(null, true);
        } else {
            // Origen no permitido
            console.log(`CORS Error: Origin ${origin} is not allowed.`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Crucial si manejas cookies o tokens en cabeceras de autorización
    optionsSuccessStatus: 204 // Para navegadores antiguos (preflight requests)
};

// 2. Usar la configuración CORS específica
app.use(cors(corsOptions));

// ------------------------------------

app.use(express.json());

// Nota: Asegúrate de que path.resolve() apunta correctamente a la raíz del proyecto
app.use("/uploads", express.static(path.join(path.resolve(), "src", "uploads")));

app.get("/", (req, res) => {
    res.send("Backend UdeC API funcionando 🚀");
});

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error en el servidor");
    }
});

// Rutas API
app.use("/api/auth", authRoutes); 
app.use("/api/vacantes", vacanteRoutes);
app.use("/api/postulaciones", postulacionRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/estudiantes", estudianteRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});