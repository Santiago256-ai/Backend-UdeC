// backend/src/controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtSecret.js";
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
        celular,
        estado: "ACTIVO"
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

// Hash bcrypt (costo 10, como las cuentas de egresado y empresa: registro y
// restablecimiento usan 10) de un texto aleatorio que nadie conoce. Si el correo
// no existe o la cuenta es de Google se compara contra él, para que la respuesta
// tarde lo mismo que con una contraseña incorrecta.
const HASH_FICTICIO = "$2a$10$J10d7x2Wwnih.4/x2FJfD.8hlS5qJxbV3HJOyEbYaZgD8m8cBOk6O";

// Correo inexistente, contraseña incorrecta, cuenta de Google y cuenta inactiva con
// contraseña incorrecta responden exactamente lo mismo: no se revela qué correos
// están registrados ni el estado de la cuenta.
const CREDENCIALES_INVALIDAS = {
    success: false,
    codigo: "credenciales_invalidas",
    message: "Correo o contraseña incorrectos."
};

// Sólo después de una contraseña correcta. El texto se conserva: el frontend
// reconoce la cuenta desactivada por la palabra "desactivada".
const CUENTA_INACTIVA = {
    egresado: "Tu cuenta ha sido desactivada por el administrador. Contacta con la Universidad.",
    empresa: "Tu cuenta de empresa ha sido desactivada por el administrador. Contacta con la Universidad."
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body ?? {};
    const identificador = typeof correo === "string" ? correo.toLowerCase() : "";

    // 1. Buscar siempre en Egresado y en Empresa, las dos a la vez.
    // Sólo lo que hace falta para validar y lo que lee el frontend de
    // localStorage['usuario']; nunca resetToken ni firebaseUid.
    const [egresado, empresa] = await Promise.all([
        prisma.egresado.findUnique({
            where: { correo: identificador },
            select: {
                id: true, nombres: true, apellidos: true, correo: true, celular: true, programa: true,
                estado: true, password: true,
            }
        }),
        prisma.empresa.findUnique({
            where: { email: identificador },
            select: { id: true, nombre: true, email: true, estado: true, password: true }
        })
    ]);

    // Si el correo estuviera en las dos tablas, manda el egresado (como antes).
    const tipo = egresado ? "egresado" : empresa ? "empresa" : null;
    const cuenta = egresado ?? empresa;

    // 2. Comparar siempre, aunque no haya cuenta o sea de Google (sin contraseña).
    const passwordValida = await bcrypt.compare(
        typeof password === "string" ? password : "",
        cuenta?.password || HASH_FICTICIO
    );
    if (!cuenta?.password || !passwordValida) {
        return res.status(200).json(CREDENCIALES_INVALIDAS);
    }

    // 3. El estado, sólo con la contraseña correcta.
    if (cuenta.estado === "INACTIVO") {
        return res.status(200).json({ success: false, codigo: "cuenta_inactiva", message: CUENTA_INACTIVA[tipo] });
    }

    const token = jwt.sign(
        { id: cuenta.id, rol: tipo },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    if (tipo === "egresado") {
        return res.json({ 
            success: true,
            token, 
            tipo: "egresado",
            usuario: {
                id: egresado.id,
                nombres: egresado.nombres,
                apellidos: egresado.apellidos,
                correo: egresado.correo,
                celular: egresado.celular,
                programa: egresado.programa
            }
        });
    }

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

  } catch (error) {
    // El detalle sólo en el log del servidor; nunca en la respuesta.
    console.error("❌ Error en login:", error);
    res.status(500).json({ success: false, message: "No pudimos iniciar sesión. Intenta de nuevo." });
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