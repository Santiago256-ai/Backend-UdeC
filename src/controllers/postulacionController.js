import prisma from "../prismaClient.js";
import { createClient } from '@supabase/supabase-js';

// 1. Inicialización de Supabase usando las variables de entorno configuradas en Vercel
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// 🟢 Crear una nueva postulación
export const crearPostulacion = async (req, res) => {
  try {
    const { usuarioId, telefono, vacanteId } = req.body;
    
    // 1. Convertir IDs a enteros
    const uId = parseInt(usuarioId);
    const vId = parseInt(vacanteId);

    // ✅ Validación: Verificar que el archivo exista en memoria (buffer)
    if (!req.file) {
      return res.status(400).json({ error: "Debe subir un archivo CV en formato PDF." });
    }

    if (isNaN(uId) || isNaN(vId) || !telefono) {
      return res.status(400).json({ error: "Faltan datos obligatorios: usuario, vacante o teléfono." });
    }

    // 2. Verificar duplicados (Si el usuario ya se postuló a esta vacante)
    const existePostulacion = await prisma.postulacion.findFirst({
        where: { vacanteId: vId, usuarioId: uId }
    });

    if (existePostulacion) {
        return res.status(409).json({ error: "Ya te has postulado a esta vacante anteriormente." });
    }

    // 3. SUBIDA A SUPABASE (En lugar de guardar en disco local /uploads)
    // Creamos un nombre único para el archivo
    const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hojas_de_vida') // Asegúrate que el bucket se llame exactamente así en Supabase
        .upload(fileName, req.file.buffer, {
            contentType: 'application/pdf',
            upsert: false
        });

    if (uploadError) {
        console.error("❌ Error de Supabase Storage:", uploadError);
        return res.status(500).json({ error: "No se pudo subir el archivo a la nube." });
    }

    // 4. Obtener la URL pública del archivo en Supabase
    const { data: { publicUrl } } = supabase.storage
        .from('hojas_de_vida')
        .getPublicUrl(fileName);

    // 5. Guardar el registro en la Base de Datos con la URL pública
    const postulacion = await prisma.postulacion.create({
      data: {
        telefono,
        cv_url: publicUrl, // Guardamos el enlace directo de Supabase (https://...)
        vacanteId: vId,
        usuarioId: uId,
        estado: "PENDIENTE", 
      },
      include: {
          usuario: true,
      }
    });
    
    console.log("✅ Postulación creada con éxito en la nube.");
    res.status(201).json(postulacion);

  } catch (error) {
    console.error("❌ Error al crear la postulación:", error);
    res.status(500).json({ error: "Error interno al procesar la postulación." });
  }
};

// --------------------------------------------------------------------------

// ✅ OBTENER POSTULACIONES POR ID DE VACANTE (Para EmpresaDashboard.jsx)
export const obtenerPostulacionesPorVacante = async (req, res) => {
    try {
        const vacanteId = parseInt(req.params.vacanteId);

        if (isNaN(vacanteId)) {
            return res.status(400).json({ error: "ID de vacante inválido." });
        }

        const postulaciones = await prisma.postulacion.findMany({
            where: { vacanteId },
            include: { 
                usuario: {
                    select: {
                        id: true,
                        nombres: true, 
                        apellidos: true, 
                        correo: true,
                    }
                } 
            },
            orderBy: { id: "desc" },
        });
    
        // No necesitamos mapear BASE_URL porque cv_url ya es una URL completa de Supabase
        res.json(postulaciones);
    } catch (error) {
        console.error("❌ Error al obtener postulaciones por vacante:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
}

// --------------------------------------------------------------------------

// 🟢 FUNCIÓN: Actualizar el estado de una postulación
export const actualizarEstadoPostulacion = async (req, res) => {
    try {
        const postulacionId = parseInt(req.params.id);
        const { estado } = req.body; 

        if (isNaN(postulacionId) || !estado) {
            return res.status(400).json({ error: "ID de postulación o estado inválido." });
        }

        const estadosValidos = ["PENDIENTE", "ACEPTADA", "RECHAZADA"];
        if (!estadosValidos.includes(estado.toUpperCase())) {
            return res.status(400).json({ error: "Estado no válido." });
        }

        const postulacionActualizada = await prisma.postulacion.update({
            where: { id: postulacionId },
            data: { estado: estado.toUpperCase() },
            include: { usuario: true } 
        });

        res.json(postulacionActualizada);

    } catch (error) {
        console.error("❌ Error al actualizar el estado:", error);
        res.status(500).json({ error: "Error interno al actualizar la postulación." });
    }
}