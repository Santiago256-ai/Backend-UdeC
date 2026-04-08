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
            orderBy: { id: "desc" }
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
        
        // 1. Extraemos todos los campos, incluyendo el nuevo campo 'estado'
        const { 
            nombres, 
            apellidos, 
            correo, 
            celular, 
            facultad, 
            programa,
            estado 
        } = req.body;

        // 2. Ejecutamos la actualización en la base de datos
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
                estado // 👈 Ahora 'estado' sí está definido
            }
        });

        // 3. Respondemos con éxito
        res.json({ 
            message: "Expediente actualizado con éxito", 
            usuario: actualizado 
        });

    } catch (error) {
        console.error("Error al actualizar egresado:", error);
        
        // Manejo de error específico por si el ID no existe
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "El egresado no fue encontrado." });
        }

        res.status(500).json({ 
            error: "No se pudo actualizar el expediente en la base de datos." 
        });
    }
};