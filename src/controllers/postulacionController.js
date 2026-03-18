import prisma from "../prismaClient.js";
import { createClient } from '@supabase/supabase-js';

// Inicialización de Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// 🟢 Crear una nueva postulación (CON VALIDACIONES DE LÍMITES)
// postulacionController.js (Versión Limpia 100% Neon)

export const crearPostulacion = async (req, res) => {
  try {
    const { telefono, vacanteId, usuarioId } = req.body;
    const uId = parseInt(usuarioId || req.user?.id); 
    const vId = parseInt(vacanteId);

    // Validaciones de IDs
    if (isNaN(uId) || isNaN(vId)) {
      return res.status(400).json({ error: "ID de usuario o vacante no válido." });
    }

    // Verificar si la vacante existe y está abierta
    const vacante = await prisma.vacante.findUnique({
        where: { id: vId }
    });

    if (!vacante) return res.status(404).json({ error: "La vacante no existe." });
    if (vacante.estado === "CERRADA") return res.status(400).json({ error: "Vacante cerrada." });

    // Guardar en Neon (Sin subir nada a Supabase)
    const postulacion = await prisma.postulacion.create({
      data: {
        telefono: String(telefono),
        vacanteId: vId,
        usuarioId: uId,
        estado: "PENDIENTE", 
        // Ya no enviamos cv_url porque el Admin verá el PerfilCV vinculado al usuarioId
      },
      include: { usuario: true }
    });
    
    res.status(201).json(postulacion);

  } catch (error) {
    console.error("❌ Error en crearPostulacion:", error);
    res.status(500).json({ error: "No se pudo procesar la postulación." });
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

// postulacionController.js

export const obtenerDetallePostulacionesAdmin = async (req, res) => {
    try {
        const { vacanteId } = req.params;

        const postulaciones = await prisma.postulacion.findMany({
            where: { 
                vacanteId: parseInt(vacanteId) 
            },
            include: {
                usuario: {
                    select: {
                        nombres: true,
                        apellidos: true,
                        correo: true,
                        cv: {
                            include: {
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
            orderBy: { fecha: "desc" }
        });

        res.json(postulaciones);
    } catch (error) {
        console.error("❌ Error Admin Postulaciones:", error.message);
        res.status(500).json({ error: "Error al obtener el listado maestro de candidatos." });
    }
};