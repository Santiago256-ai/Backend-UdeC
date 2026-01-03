import prisma from '../prismaClient.js'; // ⬅️ IMPORTANTE: Usa el cliente singleton para evitar errores en Vercel
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_debes_cambiarla';

// ==========================================
// Función de Registro de Estudiante
// ==========================================
export const crearEstudiante = async (req, res) => {
    // Extraemos 'password' también por si el frontend lo envía con ese nombre
    const { nombres, apellidos, correo, usuario, contraseña, password, rol } = req.body; 
    
    // Normalizamos la contraseña para aceptar cualquiera de los dos nombres de campo
    const passwordFinal = contraseña || password;

    // Validación básica antes de intentar crear en la DB
    if (!nombres || !apellidos || !correo || !usuario || !passwordFinal) {
        return res.status(400).json({ 
            error: 'Faltan campos obligatorios: nombres, apellidos, correo, usuario y contraseña.' 
        });
    }

    try {
        // 1. Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(passwordFinal, 10); 

        // 2. Crear el registro en Prisma
        const nuevoEstudiante = await prisma.usuario.create({
            data: { 
                nombres, 
                apellidos, 
                usuario, 
                correo, 
                password: hashedPassword,
                rol: rol || 'estudiante', // Valor por defecto si no viene en el body
            },
        });

        // 3. Devolver la respuesta (sin la contraseña)
        const { password: _, ...estudianteSinPassword } = nuevoEstudiante;
        res.status(201).json(estudianteSinPassword); 
        
    } catch (error) {
        console.error("Error detallado de Prisma:", error);

        // Error de unicidad (P2002): El correo o usuario ya existe
        if (error.code === 'P2002') {
            const campoDuplicado = error.meta?.target?.includes('correo') ? 'correo' : 'nombre de usuario';
            return res.status(409).json({ error: `El ${campoDuplicado} ya está registrado.` });
        }

        // Error de validación de Prisma (El error que veías en los logs)
        if (error.name === 'PrismaClientValidationError') {
            return res.status(400).json({ 
                error: 'Error de validación: Asegúrate de que todos los campos cumplen el formato correcto.' 
            });
        }

        res.status(500).json({ error: 'Error interno del servidor al crear estudiante.' });
    }
};

// ==========================================
// Función de Inicio de Sesión
// ==========================================
export const loginEstudiante = async (req, res) => {
    const { identificador, contraseña, password } = req.body; 
    const passwordIngresado = contraseña || password;

    if (!identificador || !passwordIngresado) {
        return res.status(400).json({ error: 'Identificador (correo/usuario) y contraseña son requeridos.' });
    }

    try {
        // 1. Buscar al usuario por correo O por nombre de usuario
        const usuarioEncontrado = await prisma.usuario.findFirst({
            where: {
                OR: [
                    { correo: identificador },
                    { usuario: identificador },
                ],
            },
        });

        // 2. Verificar si el usuario existe
        if (!usuarioEncontrado) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 3. Comparar la contraseña hasheada
        // Validamos que exista una contraseña en la DB (por si usó login social antes)
        if (!usuarioEncontrado.password) {
            return res.status(401).json({ error: 'Este usuario no tiene contraseña establecida. Intenta con Login Social.' });
        }

        const isMatch = await bcrypt.compare(passwordIngresado, usuarioEncontrado.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 4. Generar el Token JWT
        const token = jwt.sign(
            { id: usuarioEncontrado.id, correo: usuarioEncontrado.correo, rol: usuarioEncontrado.rol },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 5. Devolver la respuesta
        const { password: _, ...usuarioLogueado } = usuarioEncontrado;

        res.status(200).json({ 
            message: "Inicio de sesión exitoso.", 
            token,
            usuario: {
                ...usuarioLogueado,
                rol: usuarioLogueado.rol || 'estudiante'
            }
        });

    } catch (error) {
        console.error("Error durante el login de usuario:", error);
        res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión.' });
    }
};