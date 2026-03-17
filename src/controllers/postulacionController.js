import prisma from "../prismaClient.js";
import { createClient } from '@supabase/supabase-js';

// Inicialización de Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// 🟢 Crear una nueva postulación (CON VALIDACIONES DE LÍMITES)
export const crearPostulacion = async (req, res) => {
  try {
    // 1. Extraer datos y asegurar que sean números
    const { telefono, vacanteId, usuarioId } = req.body;
    
    const uId = parseInt(usuarioId || req.user?.id); 
    const vId = parseInt(vacanteId);

    // 2. Validaciones básicas de entrada
    if (!req.file) {
      return res.status(400).json({ error: "Debe subir un archivo CV en formato PDF." });
    }
    
    // Verificación crítica de IDs
    if (isNaN(uId) || isNaN(vId)) {
      console.error("IDs inválidos:", { uId, vId });
      return res.status(400).json({ error: "ID de usuario o vacante no válido." });
    }

    if (!telefono) {
      return res.status(400).json({ error: "El teléfono es obligatorio." });
    }

    const vacante = await prisma.vacante.findUnique({
        where: { id: vId },
        include: { _count: { select: { postulaciones: true } } }
    });

    if (!vacante) return res.status(404).json({ error: "La vacante no existe." });
    if (vacante.estado === "CERRADA") return res.status(400).json({ error: "Vacante cerrada." });

    // --- SUBIDA A SUPABASE ---
    const fileName = `${Date.now()}_${uId}_postulacion.pdf`; 
    
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hojas_de_vida')
        .upload(fileName, req.file.buffer, {
            contentType: 'application/pdf',
            upsert: true 
        });

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('hojas_de_vida')
        .getPublicUrl(fileName);

    // 4. Guardar en Base de Datos
    const postulacion = await prisma.postulacion.create({
      data: {
        telefono: String(telefono),
        cv_url: publicUrl,
        vacanteId: vId,
        usuarioId: uId,
        estado: "PENDIENTE", 
      },
      include: { usuario: true }
    });
    
    res.status(201).json(postulacion);

  } catch (error) {
    console.error("❌ Error en crearPostulacion:", error);
    res.status(500).json({ 
        error: "No se pudo procesar la postulación.", 
        detalle: error.message 
    });
  }
};

// ✅ OBTENER POSTULACIONES POR ID DE VACANTE (CORREGIDO SEGÚN SCHEMA.PRISMA)
export const obtenerPostulacionesPorVacante = async (req, res) => {
    try {
        const vacanteId = parseInt(req.params.vacanteId);
        if (isNaN(vacanteId)) return res.status(400).json({ error: "ID inválido." });

        const postulaciones = await prisma.postulacion.findMany({
            where: { vacanteId },
            include: { 
                usuario: {
                    include: {
                        cv: {
                            include: {
                                // Nombres exactos de las relaciones en tu PerfilCV (schema.prisma)
                                educacion: true,   
                                experiencia: true, 
                                aptitudes: true,
                                idiomas: true,
                                referencias: true
                            }
                        }
                    }
                } 
            },
            orderBy: { id: "desc" },
        });
    
        res.json(postulaciones);
    } catch (error) {
        // Imprime el error específico para depurar en Vercel
        console.error("❌ Error de Prisma al obtener perfil completo:", error.message);
        res.status(500).json({ 
            error: "No se pudo obtener la información completa del perfil.",
            detalle: error.message 
        });
    }
}

// 🟢 ACTUALIZAR ESTADO DE POSTULACIÓN
export const actualizarEstadoPostulacion = async (req, res) => {
    try {
        const postulacionId = parseInt(req.params.id);
        const { estado } = req.body; 

        if (isNaN(postulacionId) || !estado) {
            return res.status(400).json({ error: "Datos inválidos." });
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
        console.error("❌ Error al actualizar estado:", error.message);
        res.status(500).json({ error: "Error al actualizar la postulación." });
    }
}