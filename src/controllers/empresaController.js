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
        // Agregamos 'modalidad' a la lista de validación
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

// 🔐 NUEVA FUNCIÓN: Iniciar sesión de la empresa
export const loginEmpresa = async (req, res) => {
    try {
        // 1. Extraemos los datos del body
        const { identificador, contraseña: password } = req.body; 

        // 2. Validamos que existan antes de transformar
        if (!identificador || !password) {
            return res.status(400).json({ error: "Faltan credenciales (email y password)." });
        }

        // 3. Ahora sí, normalizamos usando 'identificador'
        const correoABuscar = identificador.toLowerCase().trim();

        // 1. Buscar la empresa por email
        const empresa = await prisma.empresa.findUnique({
            where: { email: correoABuscar },
        });

        if (!empresa) {
            return res.status(401).json({ error: "Credenciales incorrectas." });
        }

        // 2. Comparar la contraseña ingresada con el hash guardado
        const passwordMatch = await bcrypt.compare(password, empresa.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Credenciales incorrectas." });
        }

        // 3. Generar el Token Web JSON (JWT)
        const token = jwt.sign(
            { id: empresa.id, email: empresa.email, rol: 'empresa' }, // Payload
            JWT_SECRET,
            { expiresIn: '1d' } 
        );

        // 4. Devolver respuesta exitosa (sin el hash de la contraseña)
        const { password: _, ...empresaData } = empresa;

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            token,
            usuario: { 
                ...empresaData,
                rol: 'empresa' // ⬅️ CLAVE: Devuelve el rol para que el frontend pueda redireccionar
            }
        });

    } catch (error) {
        console.error("❌ Error al iniciar sesión de empresa:", error);
        res.status(500).json({ error: "Error interno del servidor." });
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

// backend/controllers/empresaController.js

// 🟢 NUEVO: Función exclusiva para el Panel Administrativo
export const obtenerEmpresasParaAdmin = async (req, res) => {
    try {
        const empresas = await prisma.empresa.findMany({
            include: {
                _count: {
                    select: { vacantes: true } // Esto nos da el número de vacantes publicadas
                }
            },
            orderBy: { nombre: "asc" } // Ordenadas alfabéticamente
        });

        // Enviamos los datos (Prisma ya omite campos si no los pedimos, pero aquí mandamos todo lo necesario)
        res.json(empresas);
    } catch (error) {
        console.error("❌ Error en obtenerEmpresasParaAdmin:", error);
        res.status(500).json({ error: "No se pudo cargar la lista de empresas aliadas." });
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

// Actualizar datos de la empresa
export const actualizarEmpresa = async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el ID de la URL
        const data = req.body;     // Obtenemos los campos enviados desde el frontend

        // 1. Verificar que la empresa exista
        const empresaExistente = await prisma.empresa.findUnique({
            where: { id: parseInt(id) }
        });

        if (!empresaExistente) {
            return res.status(404).json({ error: "Empresa no encontrada" });
        }

        // 2. Limpiar y transformar datos sensibles o tipos de datos
        // Si viene foundationYear, asegurar que sea un entero
        if (data.foundationYear) {
            data.foundationYear = parseInt(data.foundationYear);
        }

        // Evitar que el email se cambie si ya existe en otra empresa (opcional)
        // O simplemente quitar el email del objeto data para que no sea editable
        delete data.email; 
        delete data.password; // La contraseña se debería manejar en otra función por seguridad

        // 3. Actualizar en la base de datos
        const empresaActualizada = await prisma.empresa.update({
            where: { id: parseInt(id) },
            data: data
        });

        // 4. Quitar la contraseña de la respuesta
        const { password: _, ...empresaData } = empresaActualizada;

        console.log(`✅ Empresa ID ${id} actualizada con éxito`);
        res.json(empresaData);

    } catch (error) {
        console.error("❌ Error al actualizar empresa:", error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: "El NIT ya está registrado por otra empresa." });
        }
        res.status(500).json({ error: "Error interno al actualizar los datos corporativos." });
    }
};