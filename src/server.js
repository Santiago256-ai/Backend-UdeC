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

// --- CONFIGURACIÓN CORS CORREGIDA (Abierto para el dominio de Vercel) ---

const corsOptions = {
    // Usar una función para manejar el origen y permitir múltiples dominios.
    // **OPCIÓN MÁS SENCILLA Y FUNCIONAL EN PRODUCCIÓN:**
    origin: ['https://frontend-ude-c.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
    
    // Opcional: Si la opción de arriba no funciona, usa el comodín para todo:
    // origin: '*', 
    // Si usas '*', debes añadir la siguiente línea para que funcione con credenciales
    // allowedHeaders: ['Content-Type', 'Authorization'],
    
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Necesario para tokens de autenticación
    optionsSuccessStatus: 204
};

// 2. Usar la configuración CORS
app.use(cors(corsOptions));

// ------------------------------------------------------------------------

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