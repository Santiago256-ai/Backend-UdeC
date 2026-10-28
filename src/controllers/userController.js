// backend/controllers/userController.js
import { PrismaClient } from "@prisma/client";
import { ESTADOS_CUENTA, idDeRuta } from "../utils/panelAdmin.js";
const prisma = new PrismaClient();

// Rutas del panel de administración (sesión de administrador): sólo los campos
// que el panel muestra. Nunca password, resetToken, resetTokenExpiry ni firebaseUid.
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
// Lo único que el modal de edición cambia, menos el correo (cambiarlo y pedir un
// restablecimiento permitiría tomar la cuenta). El estado se valida aparte.
const CAMPOS_EGRESADO_EDITABLES = ['nombres', 'apellidos', 'celular', 'facultad', 'programa'];
const EGRESADO_NO_ENCONTRADO = { error: "El egresado no fue encontrado en la base de datos." };

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
        const id = idDeRuta(req.params.id);
        if (id === null) {
            return res.status(404).json(EGRESADO_NO_ENCONTRADO);
        }

        // 1. Sólo los campos de la lista. El panel envía la fila entera (correo,
        // _count, createdAt…) y el resto se ignora.
        const data = {};
        for (const campo of CAMPOS_EGRESADO_EDITABLES) {
            if (req.body?.[campo] !== undefined) data[campo] = req.body[campo];
        }

        // 2. Activar o desactivar: sólo ACTIVO o INACTIVO.
        const { estado } = req.body ?? {};
        if (estado !== undefined) {
            if (!ESTADOS_CUENTA.includes(estado)) {
                return res.status(400).json({ error: "Estado no válido. Usa ACTIVO o INACTIVO." });
            }
            data.estado = estado;
        }

        // 3. Ejecutamos la actualización en la base de datos (Neon/Prisma)
        const actualizado = await prisma.egresado.update({
            where: { id },
            data,
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
            return res.status(404).json(EGRESADO_NO_ENCONTRADO);
        }

        res.status(500).json({ 
            error: "No se pudo actualizar el expediente. Inténtalo de nuevo." 
        });
    }
};