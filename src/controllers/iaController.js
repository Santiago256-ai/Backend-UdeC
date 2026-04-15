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
export const procesarConsultaAgente = async (req, res) => {
    try {
        const { prompt } = req.body;

        const { text, steps } = await generateText({
            model: google('gemini-2.5-flash'),
            system: `Eres el Asistente Inteligente del Portal de Empleo de la Universidad de Cundinamarca (UdeC).

REGLAS ESTRICTAS DE COMPORTAMIENTO:
1. TIENES acceso a la base de datos a través de tus herramientas. NUNCA digas que no puedes buscar información, consultar egresados o ver estadísticas.
2. Si un usuario pregunta "¿Qué egresados tienen habilidades en X?": Ejecuta 'consultarEgresados'. OBLIGATORIAMENTE debes responder redactando la lista de los nombres, apellidos y programas de las personas que devuelva la herramienta.
3. Si un usuario pregunta "¿Cuántas postulaciones hay para la vacante Y?": Ejecuta 'contarPostulacionesVacante'. OBLIGATORIAMENTE menciona el número exacto que te devuelva la herramienta.
4. Si la herramienta devuelve un error o un array vacío [], responde educadamente: "No encontré registros que coincidan exactamente con tu búsqueda, ¿podrías intentar con otra palabra clave?".
5. Tu respuesta final NUNCA debe estar en blanco. Siempre resume los datos obtenidos de las herramientas en un lenguaje natural y profesional.`,
            prompt: prompt,
            tools: tools,
            maxSteps: 5, // Vital: Permite el ciclo [Pensar -> Usar Herramienta -> Analizar Datos -> Responder]
        });

        console.log(`🤖 Agente IA terminó su proceso en ${steps.length} paso(s).`);

        // Validación de seguridad para asegurar que el frontend siempre reciba un string
        const respuestaFinal = text || "He procesado tu solicitud en la base de datos, pero hubo un problema al redactar la respuesta. Por favor, intenta reformular tu pregunta.";

        res.json({ respuesta: respuestaFinal });

    } catch (error) {
        console.error("❌ ERROR EN IA CONTROLLER:", error);
        res.status(500).json({ 
            error: "Hubo un error de conexión con el motor de Inteligencia Artificial.",
            detalle: error.message 
        });
    }
};