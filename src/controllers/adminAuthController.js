// Inicio de sesión del panel de administración. Consulta sólo la tabla
// Administrador: /api/auth/login (egresado y empresa) nunca emite tokens de admin.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { JWT_SECRET } from "../config/jwtSecret.js";
import { normalizarUsuario } from "../utils/usuarioAdmin.js";

// Hash bcrypt (costo 12, como las cuentas reales) de un texto aleatorio que nadie
// conoce. Cuando el usuario no existe se compara contra él, para que la respuesta
// tarde lo mismo que con una contraseña incorrecta.
const HASH_FICTICIO = "$2a$12$WSNNLBr7GKMMGOBWsJ8zheUfZlt/mAyOBZdjRm4rzX.CQOQziNw4e";

// Usuario inexistente, contraseña incorrecta y cuenta inactiva responden lo mismo.
const RECHAZO = { message: "Usuario o contraseña incorrectos" };

export const loginAdmin = async (req, res) => {
    try {
        const usuario = normalizarUsuario(req.body?.usuario);
        const password = req.body?.password;
        if (!usuario || typeof password !== "string") {
            return res.status(401).json(RECHAZO);
        }

        const admin = await prisma.administrador.findUnique({
            where: { usuario },
            select: { id: true, usuario: true, nombre: true, activo: true, password: true }
        });

        const passwordValida = await bcrypt.compare(password, admin?.password ?? HASH_FICTICIO);
        if (!admin || !passwordValida || !admin.activo) {
            return res.status(401).json(RECHAZO);
        }

        await prisma.administrador.update({
            where: { id: admin.id },
            data: { ultimoAcceso: new Date() },
            select: { id: true }
        });

        // Sin "id": los controladores de egresado y empresa leen req.user.id, y un
        // token de admin no debe poder pasar por ninguno de los dos.
        const token = jwt.sign(
            { rol: "admin" },
            JWT_SECRET,
            { subject: String(admin.id), audience: "admin", expiresIn: "2h" }
        );

        return res.json({
            token,
            usuario: { usuario: admin.usuario, nombre: admin.nombre, rol: "admin" }
        });
    } catch (error) {
        console.error("Error en el login de administrador:", error.message);
        return res.status(500).json({ message: "No se pudo iniciar sesión. Intenta de nuevo." });
    }
};
