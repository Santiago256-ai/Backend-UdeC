// backend/controllers/userController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Cambiado a un nombre más descriptivo y correcto
export const obtenerTodosLosEgresados = async (req, res) => {
    try {
        // Consultamos la tabla 'egresado' que definimos en Prisma
        const egresados = await prisma.egresado.findMany({
            include: {
                _count: {
                    select: { postulaciones: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        res.json(egresados);
    } catch (error) {
        console.error("Error al obtener egresados:", error);
        res.status(500).json({ 
            error: "No se pudo conectar con la base de datos de egresados." 
        });
    }
};

// ✅ Cambiado de eliminarUsuario a eliminarEgresado
export const eliminarEgresado = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.egresado.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Registro de egresado eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar egresado:", error);
        res.status(500).json({ error: "Error al intentar eliminar el egresado." });
    }
};

// ✅ Nueva función para que el Admin edite cualquier campo del egresado
// ✅ Función para que el Admin actualice los datos y el ESTADO del egresado
export const actualizarEgresadoAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Extraemos todos los campos del cuerpo de la petición
        // Ponemos estado = "ACTIVO" como fallback por seguridad
        const { 
            nombres, 
            apellidos, 
            correo, 
            celular, 
            facultad, 
            programa,
            estado = "ACTIVO" 
        } = req.body;

        // 2. Ejecutamos la actualización en la base de datos (Neon/Prisma)
        const actualizado = await prisma.egresado.update({
            where: { 
                id: parseInt(id) 
            },
            data: {
                nombres,
                apellidos,
                correo,
                celular,
                facultad,
                programa,
                estado // 👈 Actualiza el estado (ACTIVO/INACTIVO)
            }
        });

        // 3. Respondemos con éxito y el objeto actualizado
        res.json({ 
            message: "Expediente actualizado con éxito", 
            usuario: actualizado 
        });

    } catch (error) {
        console.error("Error al actualizar egresado:", error);
        
        // Error P2025: Prisma lanza esto si el registro no existe
        if (error.code === 'P2025') {
            return res.status(404).json({ 
                error: "El egresado no fue encontrado en la base de datos." 
            });
        }

        res.status(500).json({ 
            error: "No se pudo actualizar el expediente. Inténtalo de nuevo." 
        });
    }
};