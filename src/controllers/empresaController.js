import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
const prisma = new PrismaClient();

// ⚠️ CLAVE SECRETA: Es crucial usar una clave compleja y leerla desde .env
// Si usas dotenv, asegúrate de que se cargue al inicio de tu aplicación.
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_debes_cambiarla'; 

// Crear una nueva empresa
export const crearEmpresa = async (req, res) => {
    try {
        const {
            companyName,
            email,
            phones,
            contactName,
            nit,
            modalidad,
            address,
            city,
            department,
            companyType,
            economicSector,
            foundationYear,
            annualRevenue,
            totalAssets,
            equity,
            employees,
            distributionChannels,
            mainClients,
            emailAuthorization,
            password 
        } = req.body;

        // 3. Validación de campos obligatorios (Añadimos 'password')
        // Agregamos 'modalidad' a la lista de validación pruebas
if (!companyName || !email || !phones || !contactName || !address || !city || !department || !companyType || !economicSector || !foundationYear || !annualRevenue || !employees || !distributionChannels || !mainClients || !password || !modalidad) {
    return res.status(400).json({ error: "Faltan campos obligatorios, incluyendo la modalidad y contraseña" });
}
                const emailNormalizado = email.toLowerCase().trim();

        // Opcional: Verificar si el email ya existe
        const existingEmpresa = await prisma.empresa.findUnique({
            where: { email: emailNormalizado },
        });

        if (existingEmpresa) {
            return res.status(409).json({ error: "El correo electrónico ya está registrado." });
        }

        // 4. HASHEAR LA CONTRASEÑA
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        const nuevaEmpresa = await prisma.empresa.create({
            data: {
                // Información Básica
                nombre: companyName,
                email: emailNormalizado,
                password: hashedPassword, // ⬅️ GUARDAR EL HASH
                phones,
                contactName,
                nit: nit || null,
                modalidad: modalidad,

                // Ubicación
                address,
                city,
                department,

                // Información Empresarial
                companyType,
                economicSector,
                foundationYear: parseInt(foundationYear),
                employees,

                // Información Financiera y Comercial
                annualRevenue,
                totalAssets: totalAssets || null,
                equity: equity || null,
                distributionChannels,
                mainClients,
                emailAuthorization: Boolean(emailAuthorization),
            },
        });

        // Eliminamos la contraseña del objeto que enviamos de vuelta
        const { password: _, ...empresaData } = nuevaEmpresa; 
        
        console.log("✅ Empresa creada:", empresaData);
        res.status(201).json({ 
            message: "Empresa registrada correctamente", 
            empresa: empresaData 
        });

    } catch (error) {
        console.error("❌ Error al crear empresa:", error);
        if (error.code === 'P2002') {
            res.status(409).json({ error: "Ya existe un registro con ese correo o NIT." });
        } else {
            res.status(500).json({ error: "Error interno al registrar la empresa" });
        }
    }
};

// Listar todas las empresas (Se mantiene igual)
export const listarEmpresas = async (req, res) => {
    try {
        const empresas = await prisma.empresa.findMany({
            orderBy: { id: "desc" },
            select: {
                id: true,
                nombre: true,
                email: true,
                // ... (campos de información pública)
            }
        });
        res.json(empresas);
    } catch (error) {
        console.error("❌ Error al listar empresas:", error);
        res.status(500).json({ error: "Error al listar empresas" });
    }
};

// 🟢 NUEVO: Función exclusiva para el Panel Administrativo (Empresas)
export const obtenerEmpresasParaAdmin = async (req, res) => {
    try {
        const empresas = await prisma.empresa.findMany({
            include: {
                _count: {
                    select: { vacantes: true } // Mantiene el conteo de vacantes publicadas
                }
            },
            // 🕒 CAMBIO CRÍTICO: Ordenar por fecha de creación (más recientes primero)
            // Esto es vital para que coincida con el comportamiento de 'Egresados'
            orderBy: { createdAt: "desc" } 
        });

        // Enviamos los datos completos (Prisma traerá automáticamente 'estado' y 'createdAt')
        res.json(empresas);
    } catch (error) {
        console.error("❌ Error en obtenerEmpresasParaAdmin:", error);
        res.status(500).json({ 
            error: "No se pudo cargar la lista de empresas aliadas. Verifique la conexión con la base de datos." 
        });
    }
};

// 🟢 NUEVO: Función para que el Admin elimine una empresa
export const eliminarEmpresaAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.empresa.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Empresa eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar. Verifique si la empresa tiene vacantes activas." });
    }
};

// 🟢 NUEVO: Obtener perfil de una sola empresa por ID
export const obtenerPerfilEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const empresa = await prisma.empresa.findUnique({
            where: { id: parseInt(id) },
        });

        if (!empresa) {
            return res.status(404).json({ error: "Empresa no encontrada" });
        }

        // Excluimos la contraseña por seguridad
        const { password: _, ...datosEmpresa } = empresa;
        res.json(datosEmpresa);
    } catch (error) {
        console.error("❌ Error al obtener perfil:", error);
        res.status(500).json({ error: "Error al cargar el perfil" });
    }
};

// 🟢 ACTUALIZADO: Actualizar información de la empresa (Con validación de identidad)
export const actualizarEmpresa = async (req, res) => {
    try {
        const { id } = req.params;
        const idNumerico = parseInt(id);
        const dataToUpdate = req.body;

        // 🛡️ SEGURIDAD 1: Validar que el ID del token (req.user) coincida con el ID de la URL
        // Tu middleware guarda los datos en req.user
        if (req.user.id !== idNumerico) {
            return res.status(403).json({ 
                error: "No tienes permisos para modificar este perfil. Acción denegada." 
            });
        }

        // 🛡️ SEGURIDAD 2: Protegemos campos sensibles que NO deben cambiarse por aquí
        delete dataToUpdate.email;
        delete dataToUpdate.password;
        delete dataToUpdate.id;
        delete dataToUpdate.createdAt; // Campo de sistema

        // 🛠️ FORMATEO: Aseguramos que los tipos de datos coincidan con Prisma
        if (dataToUpdate.foundationYear) {
            dataToUpdate.foundationYear = parseInt(dataToUpdate.foundationYear);
        }
        
        // Si manejas arrays (como sectores o canales), Prisma los actualiza directamente 
        // si vienen como un arreglo en el JSON.

        const empresaActualizada = await prisma.empresa.update({
            where: { id: idNumerico },
            data: dataToUpdate
        });

        // 🛡️ SEGURIDAD 3: Limpiar respuesta
        const { password: _, ...empresaSinPass } = empresaActualizada;

        console.log(`✅ Perfil de empresa ID ${id} actualizado.`);
        res.json({ 
            message: "Perfil actualizado con éxito", 
            empresa: empresaSinPass 
        });

    } catch (error) {
        console.error("❌ Error al actualizar empresa:", error);
        
        // Manejo específico si intentan poner un NIT que ya existe en otra empresa
        if (error.code === 'P2002') {
            return res.status(409).json({ error: "El NIT ingresado ya está registrado por otra empresa." });
        }

        res.status(500).json({ error: "No se pudo actualizar la información en el servidor." });
    }
};

// 🟢 NUEVO: Cambiar estado (Activo/Inactivo) desde la tabla de Admin
export const actualizarEstadoEmpresaAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // Recibe "ACTIVO" o "INACTIVO"

        const actualizada = await prisma.empresa.update({
            where: { id: parseInt(id) },
            data: { estado }
        });

        res.json({ message: "Estado de empresa actualizado", empresa: actualizada });
    } catch (error) {
        console.error("❌ Error al cambiar estado de empresa:", error);
        res.status(500).json({ error: "No se pudo cambiar el estado." });
    }
};