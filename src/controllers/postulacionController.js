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
    const { usuarioId, telefono, vacanteId } = req.body;
    
    const uId = parseInt(usuarioId);
    const vId = parseInt(vacanteId);

    // 1. Validaciones básicas de entrada
    if (!req.file) {
      return res.status(400).json({ error: "Debe subir un archivo CV en formato PDF." });
    }
    if (isNaN(uId) || isNaN(vId) || !telefono) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    // 2. BUSCAR LA VACANTE Y SUS LÍMITES
    const vacante = await prisma.vacante.findUnique({
        where: { id: vId },
        include: { _count: { select: { postulaciones: true } } } // Trae el total de postulados
    });

    if (!vacante) {
        return res.status(404).json({ error: "La vacante no existe." });
    }

    // --- INICIO DE VALIDACIONES DE LÍMITES ---

    // A. Verificar si la vacante está cerrada manualmente
    if (vacante.estado === "CERRADA") {
        return res.status(400).json({ error: "Esta vacante ya no acepta más postulaciones." });
    }

    // B. Verificar Fecha de Cierre
    if (vacante.fechaCierre && new Date(vacante.fechaCierre) < new Date()) {
        return res.status(400).json({ error: "El plazo para postularse a esta vacante ha vencido." });
    }

    // C. Verificar Límite de Postulantes
    if (vacante.limitePostulantes && vacante._count.postulaciones >= vacante.limitePostulantes) {
        return res.status(400).json({ error: "Se ha alcanzado el límite máximo de candidatos para esta vacante." });
    }

    // D. Verificar si el usuario ya se postuló (Evitar duplicados)
    const existePostulacion = await prisma.postulacion.findFirst({
        where: { vacanteId: vId, usuarioId: uId }
    });
    if (existePostulacion) {
        return res.status(409).json({ error: "Ya te has postulado a esta vacante anteriormente." });
    }

    // --- FIN DE VALIDACIONES ---


    // 3. SUBIDA A SUPABASE (Solo si pasó todas las validaciones anteriores)
    const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hojas_de_vida')
        .upload(fileName, req.file.buffer, {
            contentType: 'application/pdf',
            upsert: false
        });

    if (uploadError) {
        console.error("❌ Error de Supabase Storage:", uploadError);
        return res.status(500).json({ error: "No se pudo subir el archivo a la nube." });
    }

    const { data: { publicUrl } } = supabase.storage
        .from('hojas_de_vida')
        .getPublicUrl(fileName);

    // 4. Guardar en Base de Datos
    const postulacion = await prisma.postulacion.create({
      data: {
        telefono,
        cv_url: publicUrl,
        vacanteId: vId,
        usuarioId: uId,
        estado: "PENDIENTE", 
      },
      include: {
          usuario: true,
      }
    });
    
    res.status(201).json(postulacion);

  } catch (error) {
    console.error("❌ Error al crear la postulación:", error);
    res.status(500).json({ error: "Error interno al procesar la postulación." });
  }
};

// ✅ OBTENER POSTULACIONES POR ID DE VACANTE (ACTUALIZADO CON PERFIL COMPLETO)
export const obtenerPostulacionesPorVacante = async (req, res) => {
    try {
        const vacanteId = parseInt(req.params.vacanteId);
        if (isNaN(vacanteId)) return res.status(400).json({ error: "ID inválido." });

        const postulaciones = await prisma.postulacion.findMany({
            where: { vacanteId },
            include: { 
                usuario: {
                    include: {
                        // Traemos el PerfilCV y todas sus tablas relacionadas
                        cv: {
                            include: {
                                educacion: true,
                                experiencia: true,
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
        console.error("Error al obtener postulaciones con perfil:", error);
        res.status(500).json({ error: "Error interno del servidor." });
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