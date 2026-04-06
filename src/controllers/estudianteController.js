import prisma from '../prismaClient.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_debes_cambiarla';

// ==========================================
// Registro de Egresado (CORREGIDO)
// ==========================================
export const crearEstudiante = async (req, res) => {
    // Recibimos los campos del formulario de registro
    const { nombres, apellidos, correo, password, facultad, programa, celular } = req.body; 

    if (!nombres || !apellidos || !correo || !password) {
        return res.status(400).json({ 
            error: 'Faltan campos obligatorios: nombres, apellidos, correo y contraseña.' 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        
        // Cambiado a prisma.egresado para coincidir con tu Schema
        const nuevoEstudiante = await prisma.egresado.create({
            data: { 
                nombres, 
                apellidos, 
                correo, 
                password: hashedPassword,
                facultad,
                programa,
                celular
            },
        });

        const { password: _, ...estudianteSinPassword } = nuevoEstudiante;
        res.status(201).json(estudianteSinPassword); 
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `El correo ya está registrado.` });
        }
        res.status(500).json({ error: 'Error interno al crear estudiante.' });
    }
};

// ==========================================
// Inicio de Sesión (CORREGIDO)
// ==========================================
export const loginEstudiante = async (req, res) => {
    const { identificador, password } = req.body; 

    try {
        // Buscamos en el modelo egresado
        const usuarioEncontrado = await prisma.egresado.findUnique({
            where: { correo: identificador }
        });

        if (!usuarioEncontrado || !usuarioEncontrado.password) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, usuarioEncontrado.password);
        if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas.' });

        const token = jwt.sign(
            { id: usuarioEncontrado.id, correo: usuarioEncontrado.correo },
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
// GUARDAR / ACTUALIZAR CV (Mantenida tu lógica)
// ==========================================
export const guardarCV = async (req, res) => {
  try {
    const uId = parseInt(req.user.id);

    if (isNaN(uId)) {
      return res.status(400).json({ error: "El ID de usuario no es válido." });
    }

    const { personal, descripcion, habilidades, educacion, experiencia, idiomas, referencias } = req.body;

    const prepararParaPrisma = (lista) => {
      if (!Array.isArray(lista)) return [];
      return lista
        .filter(item => item && typeof item === 'object' && Object.keys(item).length > 0 && 
          (item.institucion || item.empresa || item.idioma || item.nombre))
        .map(({ id, perfilId, ...resto }) => resto);
    };

    const perfil = await prisma.perfilCV.upsert({
      where: { egresadoId: uId }, // Cambiado a egresadoId por tu Schema
      update: {
        celular: personal?.telefono,
        direccion: personal?.direccion,
        descripcion,
        habilidades,
        educacion: { deleteMany: {}, create: prepararParaPrisma(educacion) },
        experiencia: { deleteMany: {}, create: prepararParaPrisma(experiencia) },
        idiomas: { deleteMany: {}, create: prepararParaPrisma(idiomas) },
        referencias: { deleteMany: {}, create: prepararParaPrisma(referencias) },
      },
      create: {
        egresadoId: uId, // Cambiado a egresadoId
        celular: personal?.telefono,
        direccion: personal?.direccion,
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
    console.error("Error detallado en guardarCV:", error);
    res.status(500).json({ error: "No se pudo guardar la información", detalle: error.message });
  }
};

// ==========================================
// OBTENER CV (Mantenida tu lógica)
// ==========================================
export const obtenerMiCV = async (req, res) => {
  try {
    const uId = req.user.id;
    const cv = await prisma.perfilCV.findUnique({
      where: { egresadoId: parseInt(uId) }, // Cambiado a egresadoId
      include: {
        educacion: true,
        experiencia: true,
        idiomas: true,
        referencias: true,
        aptitudes: true,
      },
    });

    if (!cv) return res.status(200).json(null);
    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la información" });
  }
};

// ==========================================
// OBTENER PERFIL BASE (DATOS DE REGISTRO)
// ==========================================
export const obtenerPerfilBase = async (req, res) => {
    try {
        const id = req.user.id; 
        const egresado = await prisma.egresado.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!egresado) return res.status(404).json({ error: "No encontrado" });

        const { password, ...datosPublicos } = egresado;
        res.json(datosPublicos); 
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};

// ==========================================
// ACTUALIZAR DATOS DE REGISTRO
// ==========================================
export const actualizarEgresado = async (req, res) => {
    try {
        const egresadoId = parseInt(req.user.id);

        if (isNaN(egresadoId)) {
            return res.status(400).json({ error: "ID de egresado corrupto." });
        }

        const { nombres, apellidos, celular } = req.body;

        const egresadoExistente = await prisma.egresado.findUnique({
            where: { id: egresadoId }
        });

        if (!egresadoExistente) {
            return res.status(404).json({ error: "El egresado no existe." });
        }

        const egresadoActualizado = await prisma.egresado.update({
            where: { id: egresadoId },
            data: {
                nombres: nombres || egresadoExistente.nombres,
                apellidos: apellidos || egresadoExistente.apellidos,
                celular: celular || egresadoExistente.celular, 
            },
        });

        const { password, ...datosSeguros } = egresadoActualizado;
        
        res.status(200).json({
            message: "Datos de registro actualizados correctamente",
            egresado: datosSeguros
        });

    } catch (error) {
        console.error("Error al actualizar egresado:", error);
        res.status(500).json({ error: "Error interno al intentar actualizar." });
    }
};