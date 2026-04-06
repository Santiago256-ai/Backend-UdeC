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
// ==========================================
// GUARDAR / ACTUALIZAR CV (Hoja de Vida Digital)
// ==========================================
export const guardarCV = async (req, res) => {
  try {
    // ✅ CORRECCIÓN CRÍTICA: Forzamos el ID a número entero
    const usuarioId = parseInt(req.user.id);

    // Validación de seguridad para el ID
    if (isNaN(usuarioId)) {
      return res.status(400).json({ error: "El ID de usuario no es válido o no se recibió correctamente." });
    }

    const { personal, descripcion, habilidades, educacion, experiencia, idiomas, referencias } = req.body;

    // Función para limpiar IDs temporales y filtrar nulos
    const prepararParaPrisma = (lista) => {
      if (!Array.isArray(lista)) return [];
      
      return lista
        .filter(item => 
          item && 
          typeof item === 'object' && 
          Object.keys(item).length > 0 && 
          (item.institucion || item.empresa || item.idioma || item.nombre) 
        )
        .map(({ id, perfilId, ...resto }) => resto);
    };

    // Ejecución del upsert con el ID corregido
    const perfil = await prisma.perfilCV.upsert({
      where: { usuarioId: usuarioId },
      update: {
        telefono: personal?.telefono,
        email: personal?.email,
        direccion: personal?.direccion,
        descripcion,
        habilidades,
        // Limpiamos y recreamos las relaciones para evitar duplicados o IDs huérfanos
        educacion: { deleteMany: {}, create: prepararParaPrisma(educacion) },
        experiencia: { deleteMany: {}, create: prepararParaPrisma(experiencia) },
        idiomas: { deleteMany: {}, create: prepararParaPrisma(idiomas) },
        referencias: { deleteMany: {}, create: prepararParaPrisma(referencias) },
      },
      create: {
        usuarioId: usuarioId, // ✅ ID como número
        telefono: personal?.telefono,
        email: personal?.email,
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

    // Manejo específico del error de Llave Foránea de Prisma
    if (error.code === 'P2003') {
      return res.status(404).json({ 
        error: "No se pudo guardar", 
        detalle: "El usuario no existe en la base de datos. Por favor, vuelve a iniciar sesión." 
      });
    }

    res.status(500).json({ 
      error: "No se pudo guardar la información", 
      detalle: error.message 
    });
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

// En tu controlador de backend
export const obtenerPerfilBase = async (req, res) => {
    try {
        const id = req.user.id; 
        const egresado = await prisma.egresado.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!egresado) return res.status(404).json({ error: "No encontrado" });

        // LOG DE DEPURACIÓN: Mira tu terminal de VS Code al abrir el perfil
        console.log("Datos encontrados en DB:", egresado);

        res.json(egresado); 
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};
// ==========================================
// ACTUALIZAR DATOS DE REGISTRO DEL EGRESADO
// ==========================================
export const actualizarEgresado = async (req, res) => {
    try {
        // 1. Validar que el ID venga del token y sea numérico
        const egresadoId = parseInt(req.user.id);

        if (isNaN(egresadoId)) {
            return res.status(400).json({ error: "Sesión no válida o ID de egresado corrupto." });
        }

        // 2. Extraemos los campos que el usuario registró inicialmente
        // NOTA: No incluimos correo ni password por seguridad.
        const { nombres, apellidos, celular } = req.body;

        // 3. Verificamos que el egresado exista en la tabla EGRESADO
        const egresadoExistente = await prisma.egresado.findUnique({
            where: { id: egresadoId }
        });

        if (!egresadoExistente) {
            return res.status(404).json({ error: "El egresado no existe en el sistema." });
        }

        // 4. Ejecutamos la actualización
        const egresadoActualizado = await prisma.egresado.update({
            where: { id: egresadoId },
            data: {
                nombres: nombres || egresadoExistente.nombres,
                apellidos: apellidos || egresadoExistente.apellidos,
                // Si en tu modelo de Prisma el campo se llama 'celular', lo actualizamos:
                celular: celular || egresadoExistente.celular, 
            },
        });

        // 5. Limpieza de datos antes de enviar la respuesta
        const { password, resetToken, resetTokenExpiry, ...datosSeguros } = egresadoActualizado;
        
        res.status(200).json({
            message: "Datos de registro actualizados correctamente",
            egresado: datosSeguros
        });

    } catch (error) {
        console.error("Error al actualizar egresado:", error);
        res.status(500).json({ error: "Error interno del servidor al intentar actualizar." });
    }
};