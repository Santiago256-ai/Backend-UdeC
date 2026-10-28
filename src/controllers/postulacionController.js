import prisma from "../prismaClient.js";
import { createClient } from '@supabase/supabase-js';
import { enviarCorreoCambioEstado } from '../services/emailService.js';

// Inicialización de Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// 🛡️ Gestión de postulaciones (estado, anclaje, calificación): sólo una sesión de
// empresa y sólo sobre postulaciones de sus propias vacantes. Si no existe o es de
// otra empresa responde el mismo 404, para no revelar qué postulaciones existen.
// Devuelve el id numérico, o null si ya respondió.
const verificarEmpresaDuena = async (req, res) => {
    if (req.user?.rol !== "empresa") {
        res.status(403).json({ error: "Sólo la empresa dueña de la vacante puede gestionar esta postulación." });
        return null;
    }
    const postulacionId = parseInt(req.params.id);
    if (isNaN(postulacionId)) {
        res.status(400).json({ error: "Datos inválidos." });
        return null;
    }
    const postulacion = await prisma.postulacion.findUnique({
        where: { id: postulacionId },
        select: { vacante: { select: { empresaId: true } } }
    });
    if (!postulacion || postulacion.vacante?.empresaId !== req.user.id) {
        res.status(404).json({ error: "Postulación no encontrada." });
        return null;
    }
    return postulacionId;
};

// 🟢 Crear una nueva postulación (CON VALIDACIONES DE LÍMITES)
export const crearPostulacion = async (req, res) => {
  try {
    // El egresado sale del token (la ruta exige sesión de egresado); un egresadoId
    // en el cuerpo se ignora para que nadie se postule en nombre de otro.
    const { telefono, vacanteId } = req.body;
    const uId = parseInt(req.user.id);
    const vId = parseInt(vacanteId);

    if (isNaN(uId) || isNaN(vId)) {
      return res.status(400).json({ error: "ID de egresado o vacante no válido." });
    }

    // 1. Buscamos la vacante para obtener el empresaId
    const vacante = await prisma.vacante.findUnique({
        where: { id: vId },
        select: { titulo: true, estado: true, empresaId: true } // Traemos empresaId
    });

    if (!vacante) return res.status(404).json({ error: "La vacante no existe." });
    if (vacante.estado === "CERRADA") return res.status(400).json({ error: "Esta vacante ya no acepta postulaciones." });

    // 2. Verificar duplicados
    const yaPostulado = await prisma.postulacion.findUnique({
        where: { vacanteId_egresadoId: { vacanteId: vId, egresadoId: uId } }
    });

    if (yaPostulado) {
        return res.status(400).json({ error: "Ya te has postulado a esta vacante anteriormente." });
    }

    // 3. Guardar la postulación
    const postulacion = await prisma.postulacion.create({
      data: {
        telefono: String(telefono || ""),
        vacanteId: vId,
        egresadoId: uId,
        estado: "PENDIENTE", 
      },
      include: { 
        egresado: { select: { nombres: true } }
      }
    });

    // 🔔 4. CREAR NOTIFICACIÓN PARA LA EMPRESA (Aquí estaba el error)
    await prisma.notificacion.create({
      data: {
        tipo: 'POSTULACION',
        contenido: `${postulacion.egresado.nombres} se ha postulado a tu vacante: "${vacante.titulo}"`,
        empresaId: vacante.empresaId, // 👈 ESTO ES LO QUE LE FALTABA: Asignar el dueño de la notificación
        egresadoId: uId,             
        referenciaId: vId,           
        postulacionId: postulacion.id,
        vista: false,
        fecha: new Date()
      }
    });
    
    res.status(201).json(postulacion);

  } catch (error) {
    console.error("❌ Error en crearPostulacion:", error);
    res.status(500).json({ error: "No se pudo procesar la postulación." });
  }
};

// ✅ OBTENER POSTULACIONES POR ID DE VACANTE (CORREGIDO SEGÚN SCHEMA.PRISMA)
// 🛡️ Postulantes de una vacante: sólo una sesión de empresa y sólo sobre sus propias
// vacantes (también las eliminadas: las lista VacantesEliminadas). Si no existe o
// es de otra empresa responde el mismo 404.
export const obtenerPostulacionesPorVacante = async (req, res) => {
    try {
        if (req.user?.rol !== "empresa") {
            return res.status(403).json({ error: "Sólo la empresa dueña de la vacante puede ver sus postulaciones." });
        }
        const vacanteId = parseInt(req.params.vacanteId);
        if (isNaN(vacanteId)) return res.status(400).json({ error: "ID inválido." });

        const vacante = await prisma.vacante.findUnique({
            where: { id: vacanteId },
            select: { empresaId: true }
        });
        if (!vacante || vacante.empresaId !== req.user.id) {
            return res.status(404).json({ error: "Vacante no encontrada." });
        }

        const postulaciones = await prisma.postulacion.findMany({
            where: { vacanteId },
            // Sólo lo que leen la tabla de postulantes (ListaPostulacionesTable y
            // VacantesEliminadas), el chat (ChatWidget) y la hoja de vida (VerCV).
            // Sin teléfono, calificación ni comentario; nunca password, resetToken,
            // resetTokenExpiry ni firebaseUid.
            select: {
                id: true,
                estado: true,
                anclado: true,
                fecha: true,
                vacanteId: true,
                egresadoId: true,
                egresado: {
                    select: {
                        id: true,
                        nombres: true,
                        apellidos: true,
                        correo: true,
                        cv: {
                            select: {
                                celular: true,
                                direccion: true,
                                descripcion: true,
                                habilidades: true,
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
        res.status(500).json({ error: "No se pudo obtener la información completa del perfil." });
    }
}

// 🟢 ACTUALIZAR ESTADO DE POSTULACIÓN
export const actualizarEstadoPostulacion = async (req, res) => {
    try {
        const postulacionId = await verificarEmpresaDuena(req, res);
        if (postulacionId === null) return;
        const { estado } = req.body; 

        if (!estado) {
            return res.status(400).json({ error: "Datos inválidos." });
        }

        const estadosValidos = ["PENDIENTE", "REVISION", "ENTREVISTA", "PRUEBA", "FINALISTA", "CONTRATADO", "RECHAZADO"];

        if (!estadosValidos.includes(estado.toUpperCase())) {
            return res.status(400).json({ error: `Estado '${estado}' no válido.` });
        }

// 1. Actualizamos la postulación
const postulacionActualizada = await prisma.postulacion.update({
    where: { id: postulacionId },
    data: { estado: estado.toUpperCase() },
    include: { 
        egresado: { select: { nombres: true, correo: true } }, // lo justo para el correo de aviso
        vacante: { 
            select: { 
                titulo: true, 
                id: true,
                empresa: { select: { nombre: true } } // 👈 Aquí traemos el nombre de la empresa
            } 
        } 
    } 
});

// 2. 🔔 NOTIFICACIÓN INTERNA PARA EL EGRESADO
await prisma.notificacion.create({
    data: {
        tipo: 'POSTULACION',
        contenido: `Tu postulación a la vacante "${postulacionActualizada.vacante.titulo}" ha cambiado a: ${estado.toUpperCase()}`,
        egresadoId: postulacionActualizada.egresadoId,
        empresaId: null, 
        referenciaId: postulacionActualizada.vacante.id, 
        postulacionId: postulacionId, 
        vista: false,
        fecha: new Date()
    }
});

// 3. ✉️ ENVÍO DE CORREO ELECTRÓNICO
// 3. ✉️ ENVÍO DE CORREO ELECTRÓNICO
await enviarCorreoCambioEstado(
    postulacionActualizada.egresado.correo,
    postulacionActualizada.egresado.nombres,
    postulacionActualizada.vacante.titulo,
    estado.toUpperCase(),
    postulacionActualizada.vacante.empresa.nombre, 
    postulacionActualizada.id // 👈 CAMBIO: Ahora pasamos el ID de la postulación (ej: 115)
);

console.log(`✅ Notificación de estado enviada (postulación ${postulacionActualizada.id}).`);
res.json({ id: postulacionActualizada.id, estado: postulacionActualizada.estado });

    } catch (error) {
        console.error("❌ Error al actualizar estado y notificar:", error.message);
        res.status(500).json({ error: "Error al actualizar la postulación." });
    }
};

// 🟢 NUEVO: Obtener TODAS las postulaciones del sistema (Vista Global Admin)
export const obtenerTodasLasPostulacionesAdmin = async (req, res) => {
    try {
        // Sólo lo que lee ItemPostulaciones del panel: sin teléfono, chat ni anclaje.
        const postulaciones = await prisma.postulacion.findMany({
            select: {
                id: true,
                estado: true,
                fecha: true,
                calificacionAdmin: true,
                comentarioAdmin: true,
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
    const { anclado } = req.body;

    try {
        const postulacionId = await verificarEmpresaDuena(req, res);
        if (postulacionId === null) return;

        const postulacionActualizada = await prisma.postulacion.update({
            where: { id: postulacionId },
            data: { 
                anclado: Boolean(anclado) 
            },
            select: { id: true, anclado: true }
        });
        res.json(postulacionActualizada);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el anclaje en el servidor" });
    }
};

// 🟢 NUEVO: Obtener todas las postulaciones de una empresa (Para TotalPostulaciones.jsx)
// 🛡️ Sólo la propia empresa (sesión de empresa con el mismo id); otra empresa
// recibe 404.
export const obtenerPostulacionesPorEmpresa = async (req, res) => {
    try {
        if (req.user?.rol !== "empresa") {
            return res.status(403).json({ error: "Sólo la empresa puede ver sus postulaciones." });
        }
        const empresaId = parseInt(req.params.empresaId);

        if (isNaN(empresaId)) {
            return res.status(400).json({ error: "ID de empresa no válido." });
        }
        if (empresaId !== req.user.id) {
            return res.status(404).json({ error: "Empresa no encontrada." });
        }

        const postulaciones = await prisma.postulacion.findMany({
            where: {
                vacante: {
                    empresaId: empresaId
                }
            },
            // Sólo lo que lee TotalPostulaciones (que muestra y edita la calificación
            // y el comentario). Sin teléfono ni correo.
            select: {
                id: true,
                estado: true,
                fecha: true,
                fechaActualizacion: true,
                calificacionAdmin: true,
                comentarioAdmin: true,
                egresado: {
                    select: {
                        nombres: true,
                        apellidos: true
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
        const postulacionId = await verificarEmpresaDuena(req, res);
        if (postulacionId === null) return;
        const { calificacion, comentario } = req.body;

        const actualizada = await prisma.postulacion.update({
            where: { id: postulacionId },
            data: {
                calificacionAdmin: parseInt(calificacion),
                comentarioAdmin: comentario
            },
            select: { id: true, calificacionAdmin: true, comentarioAdmin: true }
        });

        res.json({ message: "Calificación guardada", actualizada });
    } catch (error) {
        res.status(500).json({ error: "Error al calificar" });
    }
};