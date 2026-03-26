// backend/src/controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Importación de Firebase Admin
import admin from "../config/firebase-admin.js"; 

dotenv.config();
const prisma = new PrismaClient();

// =========================================================
// REGISTRO DE EGRESADOS
// =========================================================
export const register = async (req, res) => {
  try {
    const { nombres, apellidos, correo, password } = req.body; 

    // ✅ NORMALIZAR A MINÚSCULAS
    const correoMinusculas = correo.toLowerCase();

    // 1. Verificar usando la variable normalizada
    const existe = await prisma.egresado.findUnique({ where: { correo: correoMinusculas } });
    if (existe) return res.status(400).json({ message: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoEgresado = await prisma.egresado.create({
      data: { 
        nombres, 
        apellidos, 
        correo: correoMinusculas, // ✅ Se guarda en minúsculas
        password: hashedPassword 
      },
    });

    res.status(201).json(nuevoEgresado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========================================================
// LOGIN MULTIPERFIL (EGRESADO / EMPRESA)
// =========================================================
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // ✅ NORMALIZAR EL BUSCADOR
    const identificador = correo.toLowerCase();

    // 1. Buscar en Egresado usando el identificador normalizado
    let egresado = await prisma.egresado.findUnique({ where: { correo: identificador } });
    
    if (egresado) {
        if (!egresado.password) {
            return res.status(200).json({ success: false, message: "Inicia sesión con Google." });
        }
        const passwordValida = await bcrypt.compare(password, egresado.password);
        if (!passwordValida) return res.status(200).json({ success: false, message: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: egresado.id, rol: "egresado" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({ 
            success: true, // ✅ Para tu lógica de frontend
            token, 
            tipo: "egresado", 
            usuario: egresado 
        });
    }

    // 2. Buscar en Empresa usando el identificador normalizado
    const empresa = await prisma.empresa.findUnique({ where: { email: identificador } });

    if (empresa) {
        const passwordValida = await bcrypt.compare(password, empresa.password);
        if (!passwordValida) return res.status(200).json({ success: false, message: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: empresa.id, rol: "empresa" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({ 
            success: true,
            token, 
            tipo: "empresa", 
            usuario: {
                id: empresa.id,
                nombres: empresa.nombre,
                correo: empresa.email,
                rol: "empresa"
            } 
        });
    }

    // 3. ✅ STATUS 200 PARA CONSOLA LIMPIA
    return res.status(200).json({ success: false, message: "Credenciales no encontradas" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========================================================
// LOGIN SOCIAL (FIREBASE) ADAPTADO A EGRESADOS
// =========================================================
export const socialLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Token de ID de Firebase es requerido." });
  }

  try {
    // 1. Verificar el token con Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken; 

    // 2. Buscar en la tabla Egresado
    let egresado = await prisma.egresado.findUnique({ 
        where: { correo: email }
    });

    if (!egresado) {
      // 3. Registrar automáticamente como Egresado si no existe
      const parts = name ? name.split(' ').filter(p => p.length > 0) : ['Egresado', 'UdeC'];
      const nombres = parts[0];
      const apellidos = parts.slice(1).join(' ') || 'Social';
      
      egresado = await prisma.egresado.create({
        data: { 
            correo: email,
            nombres: nombres,
            apellidos: apellidos,
            firebaseUid: uid, 
            password: null // Login social no requiere password local
        }
      });
    } else {
        // 4. Actualizar el UID si el registro era tradicional
        if (!egresado.firebaseUid) {
            egresado = await prisma.egresado.update({
                where: { id: egresado.id },
                data: { firebaseUid: uid }
            });
        }
    }
    
    // 5. Generar JWT de sesión
    const token = jwt.sign(
      { id: egresado.id, rol: "egresado" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. Respuesta
    return res.status(200).json({
        message: "Login social exitoso",
        token: token,
        tipo: "egresado",
        usuario: egresado
    });

  } catch (error) {
    console.error("Error en el Login Social:", error.message);
    return res.status(500).json({ message: "Error interno del servidor en login social." });
  }
};