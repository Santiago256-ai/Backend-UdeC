import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🟢 1. Crear una nueva vacante (CORREGIDO con límites y validación de empresa)
// 🟢 1. Crear una nueva vacante (ACTUALIZADO con nuevos campos)
export const crearVacante = async (req, res) => {
    try {
        console.log("📩 Datos recibidos:", req.body);
        
        const { 
            titulo, 
            descripcion, 
            ubicacion,
            tipo, // Tipo de contrato
            jornada,      // 🆕 Nuevo
            modalidad,
            tipoSalario,  // 🆕 Nuevo
            salario,
            horario,      // 🆕 Nuevo
            empresaId,
            fechaCierre,
            limitePostulantes 
        } = req.body;

        // --- INICIO DE VALIDACIÓN MEJORADA ---

        // 1. Validación de campos obligatorios básicos (Actualizada con los nuevos)
        if (!titulo || !descripcion || !ubicacion || !tipo || !jornada || !modalidad || !tipoSalario || !horario) {
            console.error("❌ ERROR 400: Faltan datos obligatorios.");
            return res.status(400).json({ error: "Faltan campos obligatorios para publicar la vacante." });
        }
        
        // 2. VALIDACIÓN CRÍTICA: ID de la Empresa
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
                jornada,      // 🆕 Guardado en BD
                modalidad,
                tipoSalario,  // 🆕 Guardado en BD
                salario: salario || null,
                horario,      // 🆕 Guardado en BD
                empresaId: idEmpresaNumerico,
                fechaCierre: fechaCierre ? new Date(fechaCierre) : null,
                limitePostulantes: limitePostulantes ? parseInt(limitePostulantes) : null,
                estado: "ABIERTA" 
            },
        });

        console.log("✅ Vacante creada exitosamente:", vacante.id);
        res.status(201).json(vacante);

    } catch (error) {
        console.error("❌ Error 500 al crear vacante:", error.message);
        res.status(500).json({ error: "Error interno al crear la vacante." });
    }
};

// 🟡 2. Listar vacantes por ID de empresa
// 🟡 2. Listar vacantes por ID de empresa (DINÁMICO PARA ELIMINADAS)
export const listarVacantesPorEmpresa = async (req, res) => {
    try {
        const empresaId = parseInt(req.params.id); 
        const { estado } = req.query; // Capturamos el ?estado= de la URL

        if (isNaN(empresaId)) {
            return res.status(400).json({ error: "ID de empresa inválido." });
        }

        // Definimos el filtro base
        let filtro = { empresaId: empresaId };

        // LÓGICA DINÁMICA:
        if (estado === "ELIMINADA") {
            // Si el front pide las eliminadas, filtramos SOLO por ese estado
            filtro.estado = "ELIMINADA";
        } else {
            // Si no pide nada (Panel Principal), mostramos todo lo que NO esté eliminado
            filtro.estado = { not: "ELIMINADA" };
        }

        const vacantes = await prisma.vacante.findMany({
            where: filtro, 
            include: {
                _count: {
                    select: { postulaciones: true }
                }
            },
            // 🟢 MODIFICACIÓN AQUÍ:
            // Usamos updatedAt para que la última que se eliminó aparezca primero
            orderBy: { updatedAt: "desc" }, 
        });

        res.json(vacantes);
    } catch (error) {
        console.error("❌ Error al listar vacantes:", error);
        res.status(500).json({ error: "Error interno al listar las vacantes." });
    }
};

// 🟡 3. Listar todas las vacantes (Para el feed de estudiantes)
// 🟡 3. Listar todas las vacantes (Para el feed de estudiantes) - CORREGIDO
export const listarVacantes = async (req, res) => {
    try {
        // 🟢 AJUSTE DE FECHA:
        // Obtenemos el momento actual, pero lo seteamos al inicio del día (00:00:00)
        // Esto asegura que si una vacante vence HOY, todavía sea visible hasta que termine el día.
        const hoyInicio = new Date();
        hoyInicio.setHours(0, 0, 0, 0);

        const vacantes = await prisma.vacante.findMany({
            where: {
                estado: "ABIERTA",
                // CONDICIÓN 1: La fecha de cierre debe ser mayor o igual al inicio de hoy
                // (O sea, hoy o cualquier día futuro) o ser nula.
                OR: [
                    { fechaCierre: { gte: hoyInicio } },
                    { fechaCierre: null }
                ],
            },
            include: {
                empresa: true,
                postulaciones: {
                    select: {
                        id: true,
                        egresadoId: true,
                        estado: true,
                        fecha: true
                    }
                },
                _count: {
                    select: { postulaciones: true }
                }
            },
            orderBy: { id: "desc" },
        });

        // CONDICIÓN 2: Filtrar programáticamente las que ya cumplieron el límite de cupos
        const vacantesDisponibles = vacantes.filter(vacante => {
            if (!vacante.limitePostulantes) return true;
            // Solo devolvemos las que tengan menos postulados que el límite
            return vacante._count.postulaciones < vacante.limitePostulantes;
        });

        res.json(vacantesDisponibles);
    } catch (error) {
        console.error("❌ Error al listar vacantes filtradas:", error.message);
        res.status(500).json({ error: "Error interno al listar vacantes." });
    }
};

// 🔴 4. Eliminar una vacante por ID
// 🔴 4. Eliminar una vacante (Ahora es un BORRADO LÓGICO / SOFT DELETE)
export const eliminarVacante = async (req, res) => {
    try {
        const { id } = req.params;
        const idNumerico = parseInt(id);

        if (isNaN(idNumerico)) {
            return res.status(400).json({ error: "ID inválido." });
        }

        // En lugar de borrar, ACTUALIZAMOS el estado
        const vacanteEliminada = await prisma.vacante.update({
            where: { id: idNumerico },
            data: { 
                estado: "ELIMINADA" // <-- Este cambio la "mueve" de vista
            },
        });

        console.log("♻️ Vacante movida a la papelera:", idNumerico);
        res.json({ message: "Vacante movida a la papelera correctamente.", vacante: vacanteEliminada });

    } catch (error) {
        console.error("❌ Error al realizar borrado lógico:", error.message);
        res.status(500).json({ error: "Error interno al eliminar vacante." });
    }
};

// 🟢 NUEVO: Función para Reactivar Vacante (El botón de "Rehacer" de tu frontend)
export const reactivarVacante = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.vacante.update({
            where: { id: parseInt(id) },
            data: { estado: "ABIERTA" }
        });
        res.json({ message: "Vacante reactivada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al reactivar" });
    }
};

// 💀 NUEVO: Función para Borrado Definitivo (El icono rojo de la papelera)
export const eliminarDefinitivamente = async (req, res) => {
    try {
        const { id } = req.params;
        const idNumerico = parseInt(id);

        // Borramos postulaciones primero por la clave foránea
        await prisma.postulacion.deleteMany({ where: { vacanteId: idNumerico } });
        // Borramos mensajes asociados
        await prisma.mensaje.deleteMany({ where: { vacanteId: idNumerico } });
        
        await prisma.vacante.delete({ where: { id: idNumerico } });
        
        res.json({ message: "Vacante borrada permanentemente" });
    } catch (error) {
        res.status(500).json({ error: "Error al borrar definitivamente" });
    }
};

// 🔵 5. Actualizar una vacante existente
export const actualizarVacante = async (req, res) => {
    try {
        const { id } = req.params;
        const idNumerico = parseInt(id);

        if (isNaN(idNumerico)) {
            return res.status(400).json({ error: "ID de vacante inválido." });
        }

        const { 
            titulo, descripcion, ubicacion, tipo, 
            jornada, modalidad, tipoSalario, salario, 
            horario, fechaCierre, limitePostulantes, estado 
        } = req.body;

        const vacanteActualizada = await prisma.vacante.update({
            where: { id: idNumerico },
            data: {
                titulo,
                descripcion,
                ubicacion,
                tipo,
                jornada,
                modalidad,
                tipoSalario,
                salario: salario || null,
                horario,
                // Conversión de tipos para Prisma
                fechaCierre: fechaCierre ? new Date(fechaCierre) : null,
                limitePostulantes: limitePostulantes ? parseInt(limitePostulantes) : null,
                estado: estado || undefined // Mantiene el estado actual si no se envía
            },
        });

        console.log("✅ Vacante actualizada:", idNumerico);
        res.json(vacanteActualizada);
    } catch (error) {
        console.error("❌ Error al actualizar vacante:", error.message);
        res.status(500).json({ error: "Error interno al actualizar la vacante." });
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