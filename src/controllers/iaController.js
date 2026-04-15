import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../prismaClient.js';

// ==========================================
// 1. DEFINICIÓN DE HERRAMIENTAS (TOOLS)
// ==========================================
const tools = {
    // HERRAMIENTA A: Buscar Egresados por Habilidad/Carrera
    consultarEgresados: tool({
        description: 'Usa esta herramienta cuando te pregunten por candidatos, egresados o personas con habilidades específicas (ej: PHP, React, Python) o de un programa académico.',
        parameters: z.object({
            filtro: z.string().describe('Palabra clave a buscar: habilidad, tecnología, o nombre de la carrera.')
        }),
        execute: async ({ filtro }) => {
            console.log(`🔍 IA Buscando Egresados con filtro: ${filtro}`);
            
            // Usamos la misma estructura de Egresado + PerfilCV de tu sistema
            const resultados = await prisma.egresado.findMany({
                where: {
                    estado: 'ACTIVO',
                    OR: [
                        { nombres: { contains: filtro, mode: 'insensitive' } },
                        { programa: { contains: filtro, mode: 'insensitive' } },
                        {
                            cv: {
                                OR: [
                                    { habilidades: { contains: filtro, mode: 'insensitive' } },
                                    { descripcion: { contains: filtro, mode: 'insensitive' } }
                                ]
                            }
                        }
                    ]
                },
                select: {
                    nombres: true,
                    apellidos: true,
                    correo: true,
                    programa: true,
                    cv: {
                        select: { habilidades: true }
                    }
                }
            });
            return resultados;
        }
    }),

    // HERRAMIENTA B: Ver Postulaciones de una Vacante Específica
    contarPostulacionesVacante: tool({
        description: 'Usa esta herramienta cuando te pregunten cuántas personas se han postulado o aplicado a una vacante, empleo u oferta de trabajo específica.',
        parameters: z.object({
            tituloVacante: z.string().describe('El título, cargo o nombre de la vacante, ej: Psicólogo en domicilio, Desarrollador, etc.')
        }),
        execute: async ({ tituloVacante }) => {
            console.log(`🔍 IA Buscando Vacante: ${tituloVacante}`);
            
            // Usamos la relación _count que ya usas en vacanteController
            const vacante = await prisma.vacante.findFirst({
                where: {
                    titulo: { contains: tituloVacante, mode: 'insensitive' }
                },
                include: {
                    _count: { select: { postulaciones: true } }
                }
            });

            if (!vacante) {
                return { error: `No se encontró ninguna vacante con el título: ${tituloVacante}` };
            }

            return {
                tituloExacto: vacante.titulo,
                estadoDeVacante: vacante.estado,
                totalPostulados: vacante._count.postulaciones
            };
        }
    }),

    // HERRAMIENTA C: Estadísticas Generales
    verEstadisticasGlobales: tool({
        description: 'Usa esta herramienta si te preguntan cuántas vacantes u ofertas hay publicadas o disponibles en total.',
        parameters: z.object({}),
        execute: async () => {
            console.log(`🔍 IA Consultando total de vacantes abiertas`);
            const total = await prisma.vacante.count({
                where: { estado: 'ABIERTA' }
            });
            return { vacantesAbiertasEnElPortal: total };
        }
    })
};

// ==========================================
// 2. CONTROLADOR PRINCIPAL DEL AGENTE
// ==========================================
// 2. CONTROLADOR PRINCIPAL DEL AGENTE
export const procesarConsultaAgente = async (req, res) => {
    try {
        const { prompt } = req.body;

        // Añadimos 'toolResults' para capturar los datos crudos por si la IA se queda callada
        const { text, steps, toolResults } = await generateText({
            model: google('gemini-2.5-flash'),
            system: `Eres el Asistente Inteligente del Portal de Empleo de la Universidad de Cundinamarca (UdeC).

REGLAS ESTRICTAS DE COMPORTAMIENTO:
1. TIENES acceso a la base de datos a través de tus herramientas. NUNCA digas que no puedes buscar información.
2. Si un usuario pregunta "¿Qué egresados tienen habilidades en X?": Ejecuta 'consultarEgresados' y OBLIGATORIAMENTE redacta una lista con los nombres.
3. Si un usuario pregunta "¿Cuántas postulaciones hay para la vacante Y?": Ejecuta 'contarPostulacionesVacante' y da el número exacto.
4. Tu respuesta final NUNCA debe estar en blanco. Siempre resume los datos obtenidos.`,
            prompt: prompt,
            tools: tools,
            maxSteps: 5,
        });

        console.log(`🤖 Agente IA terminó su proceso en ${steps?.length || 1} paso(s).`);

        let respuestaFinal = text;

        // 🛡️ EL SALVAVIDAS: Si el texto está vacío pero Prisma sí devolvió datos, mostramos los datos crudos.
        if (!respuestaFinal && toolResults && toolResults.length > 0) {
            console.log("⚠️ La IA no resumió el texto. Forzando la salida de datos crudos.");
            // Extraemos la información que encontró Prisma en el Paso 1
            const datosEncontrados = toolResults[0].result;
            respuestaFinal = "Encontré estos datos en el sistema:\n\n" + JSON.stringify(datosEncontrados, null, 2);
        } else if (!respuestaFinal) {
            respuestaFinal = "He procesado tu solicitud, pero no encontré coincidencias en la base de datos.";
        }

        res.json({ respuesta: respuestaFinal });

    } catch (error) {
        console.error("❌ ERROR EN IA CONTROLLER:", error);
        res.status(500).json({ 
            error: "Hubo un error de conexión con el motor de Inteligencia Artificial.",
            detalle: error.message 
        });
    }
};