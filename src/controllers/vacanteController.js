import prisma from "../prismaClient.js";

// 🟢 1. Crear una nueva vacante (CORREGIDO con límites y validación de empresa)
export const crearVacante = async (req, res) => {
    try {
        console.log("📩 Datos recibidos:", req.body);
        
        const { 
            titulo, 
            descripcion, 
            ubicacion,
            tipo,
            modalidad,
            salario,
            empresaId,
            // 🆕 Nuevos campos recibidos
            fechaCierre,
            limitePostulantes 
        } = req.body;

        // --- INICIO DE VALIDACIÓN MEJORADA ---

        // 1. Validación de campos obligatorios básicos
        if (!titulo || !descripcion || !ubicacion || !tipo || !modalidad) {
            console.error("❌ ERROR 400: Faltan datos obligatorios.");
            return res.status(400).json({ error: "Faltan campos obligatorios (título, descripción, ubicación, tipo, modalidad)." });
        }
        
        // 2. ✅ VALIDACIÓN CRÍTICA: ID de la Empresa
        const idEmpresaNumerico = parseInt(empresaId);
        if (!empresaId || isNaN(idEmpresaNumerico) || idEmpresaNumerico <= 0) {
            console.error(`❌ ERROR 401: ID de empresa inválido. Valor: ${empresaId}`);
            return res.status(401).json({ error: "No autorizado. Sesión de empresa no válida." });
        }

        // --- FIN DE VALIDACIÓN ---

        const vacante = await prisma.vacante.create({
            data: { 
                titulo, 
                descripcion, 
                ubicacion,
                tipo,
                modalidad,
                salario: salario || null,
                empresaId: idEmpresaNumerico,
                // 🆕 Guardado de nuevos campos con formateo de tipos
                fechaCierre: fechaCierre ? new Date(fechaCierre) : null,
                limitePostulantes: limitePostulantes ? parseInt(limitePostulantes) : null,
                estado: "ABIERTA" // Estado por defecto
            },
        });

        console.log("✅ Vacante creada exitosamente:", vacante.id);
        res.status(201).json(vacante);

    } catch (error) {
        console.error("❌ Error 500 al crear vacante:", error.message);
        res.status(500).json({ error: "Error interno al crear la vacante. Verifique la conexión a la base de datos." });
    }
};

// 🟡 2. Listar vacantes por ID de empresa
export const listarVacantesPorEmpresa = async (req, res) => {
    try {
        const empresaId = parseInt(req.params.id); 

        if (isNaN(empresaId)) {
            return res.status(400).json({ error: "ID de empresa inválido." });
        }

        const vacantes = await prisma.vacante.findMany({
            where: { empresaId: empresaId }, 
            orderBy: { id: "desc" },
        });

        res.json(vacantes);
    } catch (error) {
        console.error("❌ Error al listar vacantes por empresa:", error);
        res.status(500).json({ error: "Error interno al listar las vacantes." });
    }
};

// 🟡 3. Listar todas las vacantes (Para el feed de estudiantes)
export const listarVacantes = async (req, res) => {
    try {
        const vacantes = await prisma.vacante.findMany({
            where: {
                // Opcional: Solo mostrar vacantes abiertas
                estado: "ABIERTA"
            },
            orderBy: { id: "desc" },
        });
        res.json(vacantes);
    } catch (error) {
        console.error("❌ Error al listar vacantes:", error);
        res.status(500).json({ error: "Error interno al listar vacantes." });
    }
};

// 🔴 4. Eliminar una vacante por ID
export const eliminarVacante = async (req, res) => {
    try {
        const { id } = req.params;
        const idNumerico = parseInt(id);

        if (isNaN(idNumerico)) {
            return res.status(400).json({ error: "El ID de la vacante es obligatorio y debe ser numérico." });
        }

        const vacanteExistente = await prisma.vacante.findUnique({
            where: { id: idNumerico },
        });

        if (!vacanteExistente) {
            return res.status(404).json({ error: "Vacante no encontrada." });
        }

        // Primero eliminamos la vacante (Prisma se encarga si hay Cascade, 
        // de lo contrario asegúrate de que no haya postulaciones huérfanas)
        await prisma.vacante.delete({
            where: { id: idNumerico },
        });

        console.log("🗑️ Vacante eliminada:", id);
        res.json({ message: "Vacante eliminada correctamente." });
    } catch (error) {
        console.error("❌ Error al eliminar vacante:", error);
        res.status(500).json({ error: "Error interno al eliminar vacante." });
    }
};

// vacanteController.js

export const listarTodasLasVacantesAdmin = async (req, res) => {
    try {
        const vacantes = await prisma.vacante.findMany({
            include: {
                empresa: {
                    select: {
                        nombre: true,
                        nit: true
                    }
                }
            },
            orderBy: { fechaCreacion: "desc" },
        });
        res.json(vacantes);
    } catch (error) {
        console.error("❌ Error al listar vacantes para admin:", error);
        res.status(500).json({ error: "Error interno al obtener todas las vacantes." });
    }
};

export const obtenerEstadisticasAdmin = async (req, res) => {
    try {
        // 1. Obtenemos el inicio del día de hoy en hora de Colombia (00:00:00)
        const ahora = new Date();
        const inicioHoyCol = new Date(ahora.toLocaleString("en-US", { timeZone: "America/Bogota" }));
        inicioHoyCol.setHours(0, 0, 0, 0);

        const [totalVacantes, vacantesAbiertas, vacantesCerradas, totalUsuarios, totalEmpresas, postulacionesHoy] = await Promise.all([
            prisma.vacante.count(),
            prisma.vacante.count({ where: { estado: "ABIERTA" } }),
            prisma.vacante.count({ where: { estado: "CERRADA" } }),
            prisma.usuario.count({ where: { rol: "estudiante" } }),
            prisma.empresa.count(),
            // 🟢 CORREGIDO: Usamos inicioHoyCol que es la variable definida arriba
            prisma.postulacion.count({ 
                where: { 
                    fecha: { 
                        gte: inicioHoyCol 
                    } 
                } 
            }),
        ]);

        res.json({
            totalVacantes,
            vacantesAbiertas,
            vacantesCerradas,
            totalUsuarios,
            totalEmpresas,
            postulacionesHoy 
        });
    } catch (error) {
        console.error("Error en estadísticas:", error);
        res.status(500).json({ error: "Error al obtener estadísticas reales" });
    }
};