import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
        // 1. Configuración de tiempo (Hora Colombia)
        const ahora = new Date();
        const inicioHoyCol = new Date(ahora.toLocaleString("en-US", { timeZone: "America/Bogota" }));
        inicioHoyCol.setHours(0, 0, 0, 0);

        // Para el gráfico de crecimiento (últimos 6 meses)
        const seisMesesAtras = new Date();
        seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

        // 2. Ejecución de todas las consultas en paralelo para máxima velocidad
        const [
            totalVacantes, 
            vacantesAbiertas, 
            totalEgresados, 
            totalEmpresas, 
            postulacionesHoy,
            empresasRecientes,
            todasLasVacantesConEmpresa,
            postulacionesPorEstado, // 🟢 Datos para el Donut Chart
            egresadosHistoricos,     // 🟢 Datos para el Line Chart
            empresasHistoricas      // 🟢 Datos para el Line Chart
        ] = await Promise.all([
            prisma.vacante.count(),
            prisma.vacante.count({ where: { estado: "ABIERTA" } }),
            prisma.egresado.count(),
            prisma.empresa.count(),
            prisma.postulacion.count({ where: { fecha: { gte: inicioHoyCol } } }),
            prisma.empresa.findMany({
                take: 3,
                orderBy: { id: 'desc' },
                select: { id: true, nombre: true, nit: true }
            }),
            prisma.vacante.findMany({
                select: { empresa: { select: { economicSector: true } } }
            }),
            // Agrupar postulaciones para el gráfico de torta
            prisma.postulacion.groupBy({
                by: ['estado'],
                _count: { _all: true }
            }),
            // Crecimiento de egresados (últimos 6 meses)
            prisma.egresado.findMany({
    select: { id: true } 
}),
            prisma.empresa.findMany({
                where: { createdAt: { gte: seisMesesAtras } },
                select: { createdAt: true }
            })
        ]);

        // 3. Procesar sectores para la Matriz
        const conteoSectores = {};
        todasLasVacantesConEmpresa.forEach(v => {
            const sector = v.empresa?.economicSector?.[0] || 'Otros';
            conteoSectores[sector] = (conteoSectores[sector] || 0) + 1;
        });

        const vacantesPorSector = Object.keys(conteoSectores).map(sector => ({
            economicSector: sector,
            _count: { _all: conteoSectores[sector] }
        }));

        // 4. Procesar datos históricos para el Line Chart (Crecimiento)
        // Nota: Si tu modelo Usuario no tiene createdAt, este ejemplo usa el de Empresa
        // para simular la estructura que espera la gráfica.
        // 🟢 Cambia esta parte en tu controlador:

const mesesLabels = [];
const ahora_aux = new Date();

// Generamos los últimos 6 meses dinámicamente
for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(ahora_aux.getMonth() - i);
    const nombreMes = d.toLocaleString('es-ES', { month: 'short' });
    mesesLabels.push(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));
}

// Ahora los datos se asignarán al mes correcto (el último mes será el actual)
const datosCrecimiento = mesesLabels.map((mes, index) => {
    // Si es el último mes del array (el mes actual), ponemos el total real
    const esMesActual = index === mesesLabels.length - 1;
    return {
        mes: mes,
        egresados: esMesActual ? totalEgresados : 0, // Solo muestra el dato en el mes presente
        empresas: esMesActual ? totalEmpresas : 0
    };
});

        // 5. Respuesta final combinada
        res.json({
            totalVacantes,
            vacantesAbiertas,
            totalEgresados,
            totalEmpresas,
            postulacionesHoy,
            empresasRecientes,
            vacantesPorSector,
            postulacionesPorEstado,
            datosCrecimiento
        });

    } catch (error) {
        console.error("❌ Error en estadísticas completas:", error.message);
        res.status(500).json({ error: "Error al obtener estadísticas", detalle: error.message });
    }
};