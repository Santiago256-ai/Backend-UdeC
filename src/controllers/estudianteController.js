import prisma from '../prismaClient.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_debes_cambiarla';

// ==========================================
// Registro de Estudiante
// ==========================================
export const crearEstudiante = async (req, res) => {
    const { nombres, apellidos, correo, usuario, contraseña, password, rol } = req.body; 
    const passwordFinal = contraseña || password;

    if (!nombres || !apellidos || !correo || !usuario || !passwordFinal) {
        return res.status(400).json({ 
            error: 'Faltan campos obligatorios: nombres, apellidos, correo, usuario y contraseña.' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(passwordFinal, 10); 
        const nuevoEstudiante = await prisma.usuario.create({
            data: { 
                nombres, 
                apellidos, 
                usuario, 
                correo, 
                password: hashedPassword,
                rol: rol || 'estudiante',
            },
        });
        const { password: _, ...estudianteSinPassword } = nuevoEstudiante;
        res.status(201).json(estudianteSinPassword); 
    } catch (error) {
        if (error.code === 'P2002') {
            const campoDuplicado = error.meta?.target?.includes('correo') ? 'correo' : 'nombre de usuario';
            return res.status(409).json({ error: `El ${campoDuplicado} ya está registrado.` });
        }
        res.status(500).json({ error: 'Error interno al crear estudiante.' });
    }
};

// ==========================================
// Inicio de Sesión
// ==========================================
export const loginEstudiante = async (req, res) => {
    const { identificador, contraseña, password } = req.body; 
    const passwordIngresado = contraseña || password;

    try {
        const usuarioEncontrado = await prisma.usuario.findFirst({
            where: {
                OR: [{ correo: identificador }, { usuario: identificador }],
            },
        });

        if (!usuarioEncontrado || !usuarioEncontrado.password) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(passwordIngresado, usuarioEncontrado.password);
        if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas.' });

        const token = jwt.sign(
            { id: usuarioEncontrado.id, correo: usuarioEncontrado.correo, rol: usuarioEncontrado.rol },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        const { password: _, ...usuarioLogueado } = usuarioEncontrado;
        res.status(200).json({ message: "Éxito", token, usuario: usuarioLogueado });

    } catch (error) {
        res.status(500).json({ error: 'Error en el inicio de sesión.' });
    }
};

// ==========================================
// GUARDAR / ACTUALIZAR CV (Hoja de Vida Digital)
// ==========================================
export const guardarCV = async (req, res) => {
  try {
    const usuarioId = req.user.id; 
    const { personal, descripcion, habilidades, educacion, experiencia, idiomas, referencias } = req.body;

    // Función mejorada para limpiar IDs temporales y filtrar nulos
    const prepararParaPrisma = (lista) => 
      Array.isArray(lista) 
        ? lista
            .filter(item => item && typeof item === 'object' && Object.keys(item).length > 0)
            .map(({ id, perfilId, ...resto }) => resto) 
        : [];

    const perfil = await prisma.perfilCV.upsert({
      where: { usuarioId: usuarioId },
      update: {
        telefono: personal?.telefono,
        email: personal?.email,
        direccion: personal?.direccion, // <--- AHORA SÍ SE GUARDARÁ
        descripcion,
        habilidades,
        educacion: { deleteMany: {}, create: prepararParaPrisma(educacion) },
        experiencia: { deleteMany: {}, create: prepararParaPrisma(experiencia) },
        idiomas: { deleteMany: {}, create: prepararParaPrisma(idiomas) },
        referencias: { deleteMany: {}, create: prepararParaPrisma(referencias) },
      },
      create: {
        usuarioId: usuarioId,
        telefono: personal?.telefono,
        email: personal?.email,
        direccion: personal?.direccion, // <--- AHORA SÍ SE GUARDARÁ
        descripcion,
        habilidades,
        educacion: { create: prepararParaPrisma(educacion) },
        experiencia: { create: prepararParaPrisma(experiencia) },
        idiomas: { create: prepararParaPrisma(idiomas) },
        referencias: { create: prepararParaPrisma(referencias) },
      },
    });

    res.status(200).json({ message: "Hoja de vida guardada con éxito", data: perfil });
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({ error: "No se pudo guardar", detalle: error.message });
  }
};

// ==========================================
// OBTENER CV (Para cargar el formulario)
// ==========================================
export const obtenerMiCV = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const cv = await prisma.perfilCV.findUnique({
      where: { usuarioId: usuarioId },
      include: {
        educacion: true,
        experiencia: true,
        idiomas: true,
        referencias: true,
      },
    });

    if (!cv) return res.status(200).json(null);
    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la información" });
  }
};