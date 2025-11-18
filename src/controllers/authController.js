// backend/src/controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import admin from "../config/firebase-admin.js"; 

dotenv.config();
const prisma = new PrismaClient();

// ------------------------------------------------------------------
// LÓGICA DE AUTENTICACIÓN CENTRAL (Reutilizable)
// ------------------------------------------------------------------

/**
 * Función central de login que verifica credenciales, existencia y rol.
 */
const authenticateAndGenerateToken = async (identificador, password, requiredRole) => {
    // 🚨 NOTA: Buscamos por correo o usuario. Si tu frontend solo envía correo,
    // puedes simplificar esto a buscar solo por correo.
    const usuario = await prisma.usuario.findFirst({ 
        where: {
            OR: [
                { correo: identificador },
                { usuario: identificador }
            ]
        }
    });

    if (!usuario) {
        // Usamos un error con una propiedad 'cause' para pasar el código HTTP.
        const error = new Error("Usuario o contraseña incorrectos.");
        error.cause = 401; 
        throw error;
    }

    // 1. Verificar si es un usuario con login social (sin password)
    if (!usuario.password) {
        const error = new Error("Por favor, inicia sesión con Google o Microsoft.");
        error.cause = 401; 
        throw error;
    }
    
    // 2. Verificar el Rol
    if (usuario.rol !== requiredRole) {
        const error = new Error("Acceso denegado para este tipo de cuenta.");
        error.cause = 403; // Forbidden
        throw error;
    }

    // 3. Verificar Contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
        const error = new Error("Usuario o contraseña incorrectos.");
        error.cause = 401; 
        throw error;
    }

    // 4. Generar Token
    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    
    // Devolver el token y el objeto usuario (sin password)
    const { password: _, ...usuarioSinPassword } = usuario;
    return { token, usuario: usuarioSinPassword };
};

// ------------------------------------------------------------------
// NUEVAS FUNCIONES DE LOGIN POR ROL (Requeridas por authRoutes.js)
// ------------------------------------------------------------------

export const loginEgresado = async (req, res) => {
    try {
        const { identificador, password } = req.body;
        // Llama a la lógica central, pidiendo el rol 'egresado'
        const { token, usuario } = await authenticateAndGenerateToken(identificador, password, "egresado"); 
        
        res.json({ message: "Login exitoso", token, usuario });
    } catch (error) {
        // Usa el código de estado adjunto al error, si existe.
        const statusCode = error.cause || 500;
        res.status(statusCode).json({ message: error.message || "Error al iniciar sesión." });
    }
};

export const loginEmpresa = async (req, res) => {
    try {
        const { identificador, password } = req.body;
        // Llama a la lógica central, pidiendo el rol 'empresa'
        const { token, usuario } = await authenticateAndGenerateToken(identificador, password, "empresa"); 
        
        res.json({ message: "Login exitoso", token, usuario });
    } catch (error) {
        const statusCode = error.cause || 500;
        res.status(statusCode).json({ message: error.message || "Error al iniciar sesión." });
    }
};

// ------------------------------------------------------------------
// FUNCIONES EXISTENTES (Se mantienen)
// ------------------------------------------------------------------

// Mantienes tu función register aquí...
export const register = async (req, res) => {
    // ... tu lógica de registro
};

// Mantienes tu función socialLogin aquí...
export const socialLogin = async (req, res) => {
    // ... tu lógica de login social
};

// 🚨 Nota: Debes eliminar o renombrar la función export const login = async (req, res) => {...}
// de tu archivo, ya que ahora será reemplazada por loginEgresado y loginEmpresa.
// Si no la usas en ninguna otra ruta, puedes eliminarla.