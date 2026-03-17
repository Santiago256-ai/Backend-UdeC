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
    // NOTA: Si usas un middleware de auth, el ID suele venir en req.user.id
    const { telefono, vacanteId, usuarioId } = req.body;
    
    const uId = parseInt(usuarioId || req.user?.id); // Intentar obtener de body o del token
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

    // --- (Tu lógica de validación de vacante se mantiene igual y está perfecta) ---

    const vacante = await prisma.vacante.findUnique({
        where: { id: vId },
        include: { _count: { select: { postulaciones: true } } }
    });

    if (!vacante) return res.status(404).json({ error: "La vacante no existe." });
    if (vacante.estado === "CERRADA") return res.status(400).json({ error: "Vacante cerrada." });

    // --- SUBIDA A SUPABASE ---
    const fileName = `${Date.now()}_${uId}_postulacion.pdf`; // Nombre más limpio
    
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hojas_de_vida')
        .upload(fileName, req.file.buffer, {
            contentType: 'application/pdf',
            upsert: true // Cambiado a true para evitar errores si el usuario reintenta
        });

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('hojas_de_vida')
        .getPublicUrl(fileName);

    // 4. Guardar en Base de Datos (Asegurando tipos)
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
        detalle: error.message // Útil para depurar en Vercel
    });
  }
};

// ✅ OBTENER POSTULACIONES POR ID DE VACANTE (ACTUALIZADO CON PERFIL COMPLETO)
// Localiza esta función en tu backend
export const obtenerPostulacionesPorVacante = async (req, res) => {
    try {
        const vacanteId = parseInt(req.params.vacanteId);
        
        const postulaciones = await prisma.postulacion.findMany({
            where: { vacanteId },
            include: { 
                usuario: {
                    include: {
                        cv: {
                            include: {
                                // AQUÍ ES DONDE FALTABAN ESTAS LÍNEAS:
                                habilidades: true,   
                                aptitudes: true,
                                idiomas: true,
                                experiencia: true,   // Verifica si en tu esquema es 'experiencia' o 'experiencias'
                                educacion: true,     // Verifica si es 'educacion' o 'formacion'
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
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno" });
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
        res.status(500).json({ error: "Error al actualizar la postulación." });
    }
}