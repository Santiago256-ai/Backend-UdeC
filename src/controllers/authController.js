// backend/src/controllers/authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// 🚨 CORRECCIÓN: Usa la importación simple para 'export default'
import admin from "../config/firebase-admin.js"; 

dotenv.config();
const prisma = new PrismaClient();

// Funciones existentes de register y login (se mantienen)
// ------------------------------------------------------------------

export const register = async (req, res) => {
  try {
    // Se espera: nombres, apellidos, usuario, correo, password, rol
    const { nombres, apellidos, usuario, correo, password, rol } = req.body; 

    const existe = await prisma.usuario.findUnique({ where: { correo } });
    if (existe) return res.status(400).json({ message: "El correo ya está registrado" });

    // Verificar si el nombre de usuario ya existe
    const existeUsuario = await prisma.usuario.findUnique({ where: { usuario } });
    if (existeUsuario) return res.status(400).json({ message: "El nombre de usuario ya está en uso" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: { nombres, apellidos, usuario, correo, password: hashedPassword, rol },
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { correo } });
    
    // Si el usuario existe pero es de login social (no tiene password), retorna error.
    if (usuario && !usuario.password) {
        return res.status(401).json({ message: "Por favor, inicia sesión con Google." });
    }
    
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    // El campo password es opcional (String?) en Prisma, pero si existe, lo compara.
    const passwordValida = await bcrypt.compare(password, usuario.password || '');
    if (!passwordValida) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login exitoso", token, usuario }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🚨 FUNCIÓN CORREGIDA PARA LOGIN SOCIAL
// ------------------------------------------------------------------

export const socialLogin = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Token de ID de Firebase es requerido." });
  }

  try {
    // 1. VERIFICAR EL TOKEN CON FIREBASE ADMIN
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken; 

    // 2. BUSCAR USUARIO POR CORREO (Prisma)
    let usuario = await prisma.usuario.findUnique({ 
        where: { correo: email },
        select: { id: true, nombres: true, apellidos: true, correo: true, rol: true, firebaseUid: true }
    });

    if (!usuario) {
      // 3. REGISTRAR NUEVO USUARIO SOCIALMENTE
      console.log(`Usuario ${email} no encontrado. Registrando nuevo usuario.`);
      
      const defaultRole = "estudiante"; 
      
      // Lógica para asignar Nombres, Apellidos y Username Único
      // -----------------------------------------------------------
      const parts = name ? name.split(' ').filter(p => p.length > 0) : ['Usuario', 'Social'];
      const nombres = parts.length > 0 ? parts[0] : 'Usuario';
      const apellidos = parts.length > 1 ? parts.slice(1).join(' ') : 'Social';
      
      // Generar nombre de usuario inicial a partir del email
      const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''); // Limpia caracteres especiales
      let username = baseUsername;
      let counter = 0;
      
      // Bucle para garantizar la unicidad del nombre de usuario
      while (await prisma.usuario.findUnique({ where: { usuario: username } })) {
          counter++;
          username = `${baseUsername}${counter}`;
          if (counter > 100) { // Límite de seguridad
            throw new Error("No se pudo generar un nombre de usuario único.");
          }
      }
      // -----------------------------------------------------------

      usuario = await prisma.usuario.create({
        data: { 
            correo: email,
            nombres: nombres,
            apellidos: apellidos,
            usuario: username, // ⬅️ Nombre de usuario único
            rol: defaultRole,
            firebaseUid: uid, 
            password: null // ⬅️ Se establece como null ya que es opcional
        },
        select: { // Selecciona solo los campos que quieres devolver
            id: true,
            nombres: true,
            apellidos: true,
            correo: true,
            rol: true
        }
      });
    } else {
        // 4. LOGIN EXITOSO: Actualizar el UID si el registro era tradicional sin UID de Firebase
        if (!usuario.firebaseUid) {
             await prisma.usuario.update({
                where: { id: usuario.id },
                data: { firebaseUid: uid }
            });
            // Recargar el objeto usuario después de la actualización si es necesario.
            usuario = await prisma.usuario.findUnique({ 
                where: { id: usuario.id },
                select: { id: true, nombres: true, apellidos: true, correo: true, rol: true }
            });
        }
    }
    
    // 5. GENERAR TU PROPIO JWT DE SESIÓN
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. RESPUESTA EXITOSA
    return res.status(200).json({
        message: "Login social exitoso",
        token: token,
        usuario: {
            id: usuario.id,
            nombres: usuario.nombres, 
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            rol: usuario.rol 
        }
    });

  } catch (error) {
    console.error("Error en el Login Social:", error.message);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
        return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
    }
    return res.status(500).json({ message: "Error interno del servidor en login social." });
  }
};