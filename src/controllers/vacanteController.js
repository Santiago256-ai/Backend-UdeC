import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Ronda "dueño" (2026-10): crear, editar, mandar a la papelera, reactivar y borrar
// definitivamente exigen una sesión de empresa (authMiddleware + requireRol("empresa")
// en vacantesRoutes.js) y sólo actúan sobre vacantes de esa empresa. Se comprueban
// el rol Y el id: los ids de egresados, empresas y administradores se repiten entre
// tablas. Una vacante ajena o inexistente responde el mismo 404.
const NO_ENCONTRADA = { error: "Vacante no encontrada." };

// Estados que la empresa puede poner al editar. ELIMINADA sólo se pone con
// DELETE /:id (papelera); un estado que no cambia se acepta tal cual, porque el
// formulario de edición reenvía la vacante entera.
const ESTADOS_EDITABLES = ["ABIERTA", "CERRADA", "DESACTIVADA"];

const vacanteDeLaEmpresa = async (req) => {
    if (req.user?.rol !== "empresa") return null;
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) return null;
    const vacante = await prisma.vacante.findUnique({
        where: { id },
        select: { id: true, empresaId: true, estado: true }
    });
    return vacante && vacante.empresaId === req.user.id ? vacante : null;
};

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
            fechaCierre,
            limitePostulantes
        } = req.body; // un empresaId en el cuerpo se ignora: la empresa sale del token

        // --- INICIO DE VALIDACIÓN MEJORADA ---

        // 1. Validación de campos obligatorios básicos (Actualizada con los nuevos)
        if (!titulo || !descripcion || !ubicacion || !tipo || !jornada || !modalidad || !tipoSalario || !horario) {
            console.error("❌ ERROR 400: Faltan datos obligatorios.");
            return res.status(400).json({ error: "Faltan campos obligatorios para publicar la vacante." });
        }
        
        // 2. La empresa es la de la sesión (requireRol("empresa") ya filtró el rol).
        if (req.user?.rol !== "empresa" || !Number.isSafeInteger(req.user.id)) {
            return res.status(403).json({ error: "Sólo una empresa puede publicar vacantes." });
        }
        const idEmpresaNumerico = req.user.id;

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
        // Sólo la propia empresa (requireRol("empresa") ya filtró el rol). Otra
        // empresa, una inexistente o un id que no es número: el mismo 404.
        const empresaId = Number(req.params.id);
        if (req.user?.rol !== "empresa" || !Number.isSafeInteger(req.user.id) || empresaId !== req.user.id) {
            return res.status(404).json({ error: "Empresa no encontrada." });
        }
        const { estado } = req.query; // Capturamos el ?estado= de la URL

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
                // Ruta pública: de la empresa sólo lo que muestra el feed (nombre y
                // enlace al perfil). Nunca password, resetToken ni datos financieros.
                empresa: {
                    select: { id: true, nombre: true }
                },
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
        const vacante = await vacanteDeLaEmpresa(req);
        if (!vacante) return res.status(404).json(NO_ENCONTRADA);

        // En lugar de borrar, ACTUALIZAMOS el estado
        const vacanteEliminada = await prisma.vacante.update({
            where: { id: vacante.id },
            data: { 
                estado: "ELIMINADA" // <-- Este cambio la "mueve" de vista
            },
        });

        console.log("♻️ Vacante movida a la papelera:", vacante.id);
        res.json({ message: "Vacante movida a la papelera correctamente.", vacante: vacanteEliminada });

    } catch (error) {
        console.error("❌ Error al realizar borrado lógico:", error.message);
        res.status(500).json({ error: "Error interno al eliminar vacante." });
    }
};

// 🟢 NUEVO: Función para Reactivar Vacante (El botón de "Rehacer" de tu frontend)
export const reactivarVacante = async (req, res) => {
    try {
        const vacante = await vacanteDeLaEmpresa(req);
        if (!vacante) return res.status(404).json(NO_ENCONTRADA);

        await prisma.vacante.update({
            where: { id: vacante.id },
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
        const vacante = await vacanteDeLaEmpresa(req);
        if (!vacante) return res.status(404).json(NO_ENCONTRADA);
        const idNumerico = vacante.id;

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
// 🔵 5. Actualizar una vacante existente
export const actualizarVacante = async (req, res) => {
    try {
        const vacante = await vacanteDeLaEmpresa(req);
        if (!vacante) return res.status(404).json(NO_ENCONTRADA);

        // 🚨 Quitamos 'activa' de aquí
        const {
            titulo, descripcion, ubicacion, tipo,
            jornada, modalidad, tipoSalario, salario,
            horario, fechaCierre, limitePostulantes, estado
        } = req.body;

        if (estado !== undefined && estado !== vacante.estado && !ESTADOS_EDITABLES.includes(estado)) {
            return res.status(400).json({ error: "Estado de vacante no permitido." });
        }

        const vacanteActualizada = await prisma.vacante.update({
            where: { id: vacante.id },
            data: {
                titulo: titulo !== undefined ? titulo : undefined,
                descripcion: descripcion !== undefined ? descripcion : undefined,
                ubicacion: ubicacion !== undefined ? ubicacion : undefined,
                tipo: tipo !== undefined ? tipo : undefined,
                jornada: jornada !== undefined ? jornada : undefined,
                modalidad: modalidad !== undefined ? modalidad : undefined,
                tipoSalario: tipoSalario !== undefined ? tipoSalario : undefined,
                horario: horario !== undefined ? horario : undefined,
                salario: salario !== undefined ? (salario || null) : undefined,
                fechaCierre: fechaCierre !== undefined ? (fechaCierre ? new Date(fechaCierre) : null) : undefined,
                limitePostulantes: limitePostulantes !== undefined ? (limitePostulantes ? parseInt(limitePostulantes) : null) : undefined,
                // 👇 Solo usaremos 'estado'
                estado: estado !== undefined ? estado : undefined
            },
        });

        res.json(vacanteActualizada);
    } catch (error) {
        console.error("❌ Error al actualizar vacante:", error.message);
        res.status(500).json({ error: "Error interno al actualizar la vacante." });
    }
};

// vacanteController.js

export const listarTodasLasVacantesAdmin = async (req, res) => {
    try {
        // Sólo lo que leen ItemVacantes y el Inicio del panel.
        const vacantes = await prisma.vacante.findMany({
            select: {
                id: true,
                titulo: true,
                ubicacion: true,
                estado: true,
                empresa: {
                    select: { nombre: true }
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

        // 2. Ejecución de consultas en paralelo
        const [
            todasLasVacantesMetadata, // Traemos data para clasificar activas vs finalizadas
            totalEgresados,
            totalEmpresas,
            postulacionesHoy,
            empresasRecientes,
            postulacionesPorEstado,
            vacantesPorModalidad,
            egresadosPorFacultad
        ] = await Promise.all([
            // Obtenemos todas las vacantes que no han sido borradas para procesar su estado real
            prisma.vacante.findMany({
                where: { estado: { not: "ELIMINADA" } },
                include: {
                    _count: {
                        select: { postulaciones: true }
                    },
                    empresa: {
                        select: { economicSector: true }
                    }
                }
            }),
            prisma.egresado.count(),
            prisma.empresa.count(),
            prisma.postulacion.count({ 
                where: { 
                    fecha: { gte: inicioHoyCol } 
                } 
            }),
            prisma.empresa.findMany({
                take: 3,
                orderBy: { id: 'desc' },
                select: { id: true, nombre: true, nit: true }
            }),
            prisma.postulacion.groupBy({
                by: ['estado'],
                _count: { _all: true }
            }),
            prisma.vacante.groupBy({
                by: ['modalidad'],
                _count: { _all: true }
            }),
            prisma.egresado.groupBy({
                by: ['facultad'],
                _count: { _all: true }
            })
        ]);

        // 3. CLASIFICACIÓN INTELIGENTE DE VACANTES
        let vacantesActivas = 0;
        let vacantesFinalizadas = 0;
        const conteoSectores = {};

        todasLasVacantesMetadata.forEach(v => {
            // Lógica de disponibilidad igual a la del feed de egresados
            const fechaVencida = v.fechaCierre && new Date(v.fechaCierre) < inicioHoyCol;
            const cuposLlenos = v.limitePostulantes && v._count.postulaciones >= v.limitePostulantes;

            if (v.estado === "ABIERTA" && !fechaVencida && !cuposLlenos) {
                vacantesActivas++;
            } else {
                vacantesFinalizadas++;
            }

            // Aprovechamos el ciclo para contar sectores económicos
            const sector = v.empresa?.economicSector?.[0] || 'Otros';
            conteoSectores[sector] = (conteoSectores[sector] || 0) + 1;
        });

        // Formatear sectores para la gráfica
        const vacantesPorSector = Object.keys(conteoSectores).map(sector => ({
            economicSector: sector,
            _count: { _all: conteoSectores[sector] }
        }));

        // 4. Procesar datos históricos para el Line Chart (Crecimiento)
        const mesesLabels = [];
        const ahora_aux = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(ahora_aux.getMonth() - i);
            const nombreMes = d.toLocaleString('es-ES', { month: 'short' });
            mesesLabels.push(nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1));
        }

        const datosCrecimiento = mesesLabels.map((mes, index) => {
            const esMesActual = index === mesesLabels.length - 1;
            return {
                mes: mes,
                egresados: esMesActual ? totalEgresados : 0, 
                empresas: esMesActual ? totalEmpresas : 0
            };
        });

        // 5. Respuesta final con la nueva diferenciación de vacantes
        res.json({
            vacantesActivas,      // Reemplaza al viejo vacantesAbiertas
            vacantesFinalizadas,   // Nuevo KPI para procesos cerrados/llenos
            totalEgresados,
            totalEmpresas,
            postulacionesHoy,
            empresasRecientes,
            vacantesPorSector,
            postulacionesPorEstado,
            datosCrecimiento,
            vacantesPorModalidad,
            egresadosPorFacultad
        });

    } catch (error) {
        console.error("❌ Error en estadísticas completas:", error.message);
        res.status(500).json({ error: "Error al obtener estadísticas" });
    }
};

// 🟢 NUEVO: Dashboard de Métricas PRO para la Empresa
export const obtenerDashboardMetricasPro = async (req, res) => {
    try {
        // Sólo la propia empresa (requireRol("empresa") ya filtró el rol). Otra
        // empresa, una inexistente o un id que no es número: el mismo 404.
        const empresaIdNumerico = Number(req.params.id);
        if (req.user?.rol !== "empresa" || !Number.isSafeInteger(req.user.id) || empresaIdNumerico !== req.user.id) {
            return res.status(404).json({ error: "Empresa no encontrada." });
        }

        // 1. Todas las vacantes para KPIs y Gráficos
        const vacantes = await prisma.vacante.findMany({
            where: { empresaId: empresaIdNumerico },
            orderBy: { fechaCreacion: 'desc' },
            include: { _count: { select: { postulaciones: true } } }
        });

        // 2. Últimas 5 Postulaciones (Relacional: Vacante -> Empresa). Sólo lo que
        // lee EmpresaMetricas: sin teléfono, calificación ni comentario.
        const postulacionesRecientes = await prisma.postulacion.findMany({
            where: { vacante: { empresaId: empresaIdNumerico } },
            orderBy: { fecha: 'desc' },
            take: 5,
            select: {
                id: true,
                fecha: true,
                vacante: { select: { titulo: true } },
                egresado: { select: { nombres: true, apellidos: true } }
            }
        });

        // 3. Últimas Notificaciones de la empresa
        const notificacionesRecientes = await prisma.notificacion.findMany({
            where: { empresaId: empresaIdNumerico },
            orderBy: { fecha: 'desc' },
            take: 5,
            select: { id: true, contenido: true, fecha: true }
        });

        res.json({
            vacantes,
            postulacionesRecientes,
            notificacionesRecientes
        });

    } catch (error) {
        console.error("❌ Error en métricas PRO:", error);
        res.status(500).json({ error: "No se pudieron cargar las métricas operativas." });
    }
};