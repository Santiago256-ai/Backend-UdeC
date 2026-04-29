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
    const { telefono, vacanteId, egresadoId } = req.body;
    
    // Aseguramos que los IDs sean números
    const uId = parseInt(egresadoId || req.user?.id); 
    const vId = parseInt(vacanteId);

    // 1. Validaciones iniciales de IDs
    if (isNaN(uId) || isNaN(vId)) {
      return res.status(400).json({ error: "ID de egresado o vacante no válido." });
    }

    // 2. Verificar si la vacante existe y su estado
    const vacante = await prisma.vacante.findUnique({
        where: { id: vId }
    });

    if (!vacante) return res.status(404).json({ error: "La vacante no existe." });
    if (vacante.estado === "CERRADA") return res.status(400).json({ error: "Esta vacante ya no acepta más postulaciones." });

    // 3. Evitar duplicados usando la clave única compuesta definida en el schema
    const yaPostulado = await prisma.postulacion.findUnique({
        where: {
            vacanteId_egresadoId: {
                vacanteId: vId,
                egresadoId: uId
            }
        }
    });

    if (yaPostulado) {
        return res.status(400).json({ error: "Ya te has postulado a esta vacante anteriormente." });
    }

    // 4. Guardar la postulación en la base de datos
    // Incluimos 'egresado' y 'vacante' en el resultado para tener los nombres para la notificación
    const postulacion = await prisma.postulacion.create({
      data: {
        telefono: String(telefono || ""),
        vacanteId: vId,
        egresadoId: uId,
        estado: "PENDIENTE", 
        anclado: false,
      },
      include: { 
        egresado: {
            select: { nombres: true, apellidos: true }
        },
        vacante: {
            select: { titulo: true, empresaId: true }
        }
      }
    });

    // 🔔 5. CREAR NOTIFICACIÓN PARA LA EMPRESA
    // Esta es la parte que alimenta la sección de notificaciones de la empresa
    await prisma.notificacion.create({
      data: {
        tipo: 'POSTULACION',
        contenido: `${postulacion.egresado.nombres} se ha postulado a tu vacante: "${postulacion.vacante.titulo}"`,
        empresaId: postulacion.vacante.empresaId, // Destinatario (Empresa)
        egresadoId: uId,                         // Quien origina la acción
        referenciaId: vId,                       // ID de la vacante para redireccionar al clic
        postulacionId: postulacion.id,           // Relación directa con la postulación
        vista: false,
        fecha: new Date()
      }
    });
    
    // 6. Respuesta exitosa al frontend
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
                egresado: {
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

        const estadosValidos = ["PENDIENTE", "REVISION", "ENTREVISTA", "PRUEBA", "FINALISTA", "CONTRATADO", "RECHAZADO"];

        if (!estadosValidos.includes(estado.toUpperCase())) {
            return res.status(400).json({ 
                error: `Estado '${estado}' no válido.` 
            });
        }

        // 1. Actualizamos la postulación
        const postulacionActualizada = await prisma.postulacion.update({
            where: { id: postulacionId },
            data: { estado: estado.toUpperCase() },
            include: { 
                egresado: true,
                vacante: { select: { titulo: true, id: true } } 
            } 
        });

        // 2. 🔔 NOTIFICACIÓN PARA EL EGRESADO
        await prisma.notificacion.create({
            data: {
                tipo: 'POSTULACION',
                contenido: `Tu postulación a la vacante "${postulacionActualizada.vacante.titulo}" ha cambiado a: ${estado.toUpperCase()}`,
                egresadoId: postulacionActualizada.egresadoId, // Destinatario: Egresado
                empresaId: null, // 👈 IMPORTANTE: Aseguramos que sea null para que no le salga a la empresa
                referenciaId: postulacionActualizada.vacante.id, 
                postulacionId: postulacionId, // 👈 Esto permite el resaltado naranja que programamos
                vista: false,
                fecha: new Date()
            }
        });

        console.log(`✅ Notificación de estado enviada al egresado: ${postulacionActualizada.egresado.correo}`);
        res.json(postulacionActualizada);

    } catch (error) {
        console.error("❌ Error al actualizar estado y notificar:", error.message);
        res.status(500).json({ error: "Error al actualizar la postulación." });
    }
};

// postulacionController.js

export const obtenerDetallePostulacionesAdmin = async (req, res) => {
    try {
        const { vacanteId } = req.params;

        const postulaciones = await prisma.postulacion.findMany({
            where: { 
                vacanteId: parseInt(vacanteId) 
            },
            include: {
                egresado: {
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

// 🟢 NUEVO: Obtener TODAS las postulaciones del sistema (Vista Global Admin)
export const obtenerTodasLasPostulacionesAdmin = async (req, res) => {
    try {
        const postulaciones = await prisma.postulacion.findMany({
            include: {
                egresado: {
                    select: { nombres: true, apellidos: true, correo: true }
                },
                vacante: {
                    select: { titulo: true, empresa: { select: { nombre: true } } }
                }
            },
            orderBy: { fecha: "desc" }
        });
        res.json(postulaciones);
    } catch (error) {
        console.error("❌ Error al obtener todas las postulaciones:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// En controllers/postulacionController.js

export const actualizarAnclajePostulacion = async (req, res) => {
    const { id } = req.params;
    const { anclado } = req.body;

    try {
        const postulacionActualizada = await prisma.postulacion.update({
            where: { id: parseInt(id) },
            data: { 
                anclado: Boolean(anclado) 
            }
        });
        res.json(postulacionActualizada);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el anclaje en el servidor" });
    }
};

// 🟢 NUEVO: Obtener todas las postulaciones de una empresa (Para TotalPostulaciones.jsx)
export const obtenerPostulacionesPorEmpresa = async (req, res) => {
    try {
        const empresaId = parseInt(req.params.empresaId);

        if (isNaN(empresaId)) {
            return res.status(400).json({ error: "ID de empresa no válido." });
        }

        const postulaciones = await prisma.postulacion.findMany({
            where: {
                vacante: {
                    empresaId: empresaId
                }
            },
            include: {
                egresado: {
                    select: {
                        nombres: true,
                        apellidos: true,
                        correo: true
                    }
                },
                vacante: {
                    select: {
                        titulo: true
                    }
                }
            },
            orderBy: {
                fecha: 'desc' // Mostrar las más recientes primero
            }
        });

        res.json(postulaciones);
    } catch (error) {
        console.error("❌ Error en obtenerPostulacionesPorEmpresa:", error.message);
        res.status(500).json({ error: "No se pudieron obtener las postulaciones." });
    }
};

// 🔵 ACTUALIZADO: Calificar postulante (Seguimiento Admin)
export const calificarPostulacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { calificacion, comentario } = req.body;

        const actualizada = await prisma.postulacion.update({
            where: { id: parseInt(id) },
            data: {
                calificacionAdmin: parseInt(calificacion),
                comentarioAdmin: comentario
            }
        });

        res.json({ message: "Calificación guardada", actualizada });
    } catch (error) {
        res.status(500).json({ error: "Error al calificar" });
    }
};