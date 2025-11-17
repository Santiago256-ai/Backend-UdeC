// backend/server.js

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

import vacanteRoutes from "./routes/vacanteRoutes.js";
import postulacionRoutes from "./routes/postulacionRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";
import estudianteRoutes from "./routes/estudianteRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ⬅️ Correcto

import pool from "./database.js";

const app = express();

app.use(cors());
app.use(express.json());

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

// ⬅️ LA RUTA ESTÁ CORRECTAMENTE MONTADA
app.use("/api/auth", authRoutes); 

app.use("/api/vacantes", vacanteRoutes);
app.use("/api/postulaciones", postulacionRoutes);
app.use("/api/empresas", empresaRoutes);
app.use("/api/estudiantes", estudianteRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});