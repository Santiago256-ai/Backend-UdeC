// backend/controllers/userController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Contención (2026-10): las rutas de administración todavía no exigen rol, así
// que sólo devuelven los campos que el panel muestra. Nunca password,
// resetToken, resetTokenExpiry ni firebaseUid.
const CAMPOS_EGRESADO_ADMIN = {
    id: true,
    nombres: true,
    apellidos: true,
    correo: true,
    celular: true,
    facultad: true,
    programa: true,
    estado: true,
    createdAt: true,
};

// ✅ Cambiado a un nombre más descriptivo y correcto
export const obtenerTodosLosEgresados = async (req, res) => {
    try {
        // Consultamos la tabla 'egresado' que definimos en Prisma
        const egresados = await prisma.egresado.findMany({
            select: {
                ...CAMPOS_EGRESADO_ADMIN,
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

        // 1. Sólo los campos permitidos. El correo queda fuera: cambiarlo y pedir
        // un restablecimiento permitiría tomar la cuenta (el panel lo sigue
        // enviando y se ignora).
        const {
            nombres,
            apellidos,
            celular,
            facultad,
            programa,
            estado
        } = req.body;

        // 2. Contención (2026-10): activar o desactivar queda bloqueado hasta que
        // exista el rol de administrador. El modal de edición reenvía el estado
        // actual, así que sólo se rechaza un cambio real; el estado nunca se escribe.
        if (estado !== undefined) {
            const actual = await prisma.egresado.findUnique({
                where: { id: parseInt(id) },
                select: { estado: true }
            });
            if (!actual) {
                return res.status(404).json({ error: "El egresado no fue encontrado en la base de datos." });
            }
            if (estado !== actual.estado) {
                return res.status(403).json({
                    error: "Activar o desactivar egresados está deshabilitado temporalmente mientras se habilita el acceso de administrador."
                });
            }
        }

        // 3. Ejecutamos la actualización en la base de datos (Neon/Prisma)
        const actualizado = await prisma.egresado.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nombres,
                apellidos,
                celular,
                facultad,
                programa
            },
            select: CAMPOS_EGRESADO_ADMIN
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