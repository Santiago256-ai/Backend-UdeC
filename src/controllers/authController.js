// backend/src/controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import crypto from "crypto"; // ✅ Necesario para generar tokens aleatorios
import nodemailer from "nodemailer"; // ✅ Para enviar los correos

// Importación de Firebase Admin
import admin from "../config/firebase-admin.js"; 

dotenv.config();
const prisma = new PrismaClient();

// =========================================================
// REGISTRO DE EGRESADOS
// =========================================================
// =========================================================
// REGISTRO DE EGRESADOS (CORREGIDO)
// =========================================================
export const register = async (req, res) => {
  try {
    // 1. Extraemos TODOS los campos que envía el formulario
    const { nombres, apellidos, correo, password, facultad, programa, celular } = req.body; 

    // ✅ NORMALIZAR A MINÚSCULAS
    const correoMinusculas = correo.toLowerCase();

    // 2. Verificar si ya existe
    const existe = await prisma.egresado.findUnique({ where: { correo: correoMinusculas } });
    if (existe) return res.status(400).json({ message: "El correo ya está registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. PASAR LOS DATOS A PRISMA
    const nuevoEgresado = await prisma.egresado.create({
      data: { 
        nombres, 
        apellidos, 
        correo: correoMinusculas,
        password: hashedPassword,
        // 🟢 ESTOS SON LOS QUE FALTABAN:
        facultad,
        programa,
        celular 
      },
    });

    res.status(201).json(nuevoEgresado);
  } catch (error) {
    console.error("Error en registro:", error);
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
            success: true,
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

    return res.status(200).json({ success: false, message: "Credenciales no encontradas" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =========================================================
// 🆕 SOLICITAR RECUPERACIÓN (SIN FIREBASE)
// =========================================================
export const requestPasswordReset = async (req, res) => {
  const { correo } = req.body;
  const correoNormalizado = correo.toLowerCase();

  try {
    // 1. Buscar usuario
    const egresado = await prisma.egresado.findUnique({ where: { correo: correoNormalizado } });
    const empresa = await prisma.empresa.findUnique({ where: { email: correoNormalizado } });
    const usuario = egresado || empresa;

    if (!usuario) {
      return res.status(200).json({ success: false, message: "Si el correo es válido, recibirás un enlace." });
    }

    // 2. Generar Token único
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hora

    // 3. Guardar en BD (Neon)
    if (egresado) {
      await prisma.egresado.update({
        where: { correo: correoNormalizado },
        data: { resetToken: token, resetTokenExpiry: expiry }
      });
    } else {
      await prisma.empresa.update({
        where: { email: correoNormalizado },
        data: { resetToken: token, resetTokenExpiry: expiry }
      });
    }

    // 4. Configurar Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    

    // 5. Enviar el correo
    await transporter.sendMail({
      from: '"Portal de Empleo UdeC" <no-reply@udec.edu.co>',
      to: correoNormalizado,
      subject: "Recuperación de Contraseña - UdeC",
      html: `
        <div style="font-family: Arial, sans-serif; border-top: 5px solid #1b4332; padding: 20px;">
          <h2 style="color: #1b4332;">Hola, ${egresado ? usuario.nombres : usuario.nombre}</h2>
          <p>Has solicitado restablecer tu contraseña en el Portal de Empleo de la Universidad de Cundinamarca.</p>
          <p>Haz clic en el botón de abajo para continuar. Este enlace expira en 1 hora:</p>
          <a href="${resetUrl}" style="background-color: #1b4332; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer Contraseña</a>
          <p style="margin-top: 20px; font-size: 12px; color: #718096;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
        </div>
      `
    });

    res.json({ success: true, message: "Correo enviado con éxito." });

  } catch (error) {
    console.error("Error SMTP:", error);
    res.status(500).json({ success: false, message: "Error al enviar el correo." });
  }
};

// =========================================================
// 🆕 RESTABLECER CONTRASEÑA FINAL
// =========================================================
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Buscar el token en ambas tablas
    const egresado = await prisma.egresado.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } }
    });
    const empresa = await prisma.empresa.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } }
    });

    const usuario = egresado || empresa;
    
    if (!egresado && !empresa) {
      return res.status(200).json({ success: false, message: "Token inválido o expirado." });
    }

    // ✅ CORREGIDO: VALIDACIÓN DE CONTRASEÑA ANTERIOR AQUÍ
    const esMismaClave = await bcrypt.compare(newPassword, usuario.password);
    if (esMismaClave) {
      return res.status(200).json({ 
        success: false, 
        message: "La nueva contraseña no puede ser igual a la anterior." 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (egresado) {
      await prisma.egresado.update({
        where: { id: egresado.id },
        data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
      });
    } else {
      await prisma.empresa.update({
        where: { id: empresa.id },
        data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
      });
    }

    res.json({ success: true, message: "Contraseña actualizada con éxito." });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar contraseña." });
  }
};

// =========================================================
// LOGIN SOCIAL (FIREBASE)
// =========================================================
export const socialLogin = async (req, res) => {
  // ... (Tu código de socialLogin se mantiene igual)
};