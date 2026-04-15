import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../prismaClient.js';

// 1. DEFINICIÓN DE HERRAMIENTAS (TOOLS) AJUSTADAS A TU SCHEMA
const tools = {
    consultarEgresados: tool({
        description: 'Obligatorio usar esta herramienta para buscar egresados por habilidades técnicas (PHP, React, etc), por nombre de carrera o programa académico.',
        parameters: z.object({
            filtro: z.string().describe('La habilidad técnica, lenguaje o carrera a buscar.')
        }),
        execute: async ({ filtro }) => {
            console.log(`🔍 Agente consultando base de datos por: ${filtro}`);
            
            // Buscamos en el modelo Egresado y filtramos también por su relación PerfilCV
            return await prisma.egresado.findMany({
                where: {
                    estado: 'ACTIVO',
                    OR: [
                        { nombres: { contains: filtro, mode: 'insensitive' } },
                        { apellidos: { contains: filtro, mode: 'insensitive' } },
                        { programa: { contains: filtro, mode: 'insensitive' } },
                        {
                            cv: {
                                OR: [
                                    { habilidades: { contains: filtro, mode: 'insensitive' } },
                                    { descripcion: { contains: filtro, mode: 'insensitive' } },
                                    { programa: { contains: filtro, mode: 'insensitive' } }
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
                        select: {
                            habilidades: true
                        }
                    }
                }
            });
        }
    }),

    verEstadisticasVacantes: tool({
        description: 'Proporciona el número total de ofertas de empleo o vacantes publicadas actualmente.',
        parameters: z.object({}),
        execute: async () => {
            const conteo = await prisma.vacante.count({
                where: { estado: 'ABIERTA' }
            });
            return { totalVacantes: conteo };
        }
    })
};

// 2. CONTROLADOR PRINCIPAL CON MANEJO DE PASOS (STEPS)
export const procesarConsultaAgente = async (req, res) => {
    try {
        const { prompt } = req.body;

        const { text, steps } = await generateText({
            model: google('gemini-2.5-flash'),
            system: `Eres el Analista del Portal de Empleo de la Universidad de Cundinamarca (UdeC).
                     
                     REGLAS DE ORO:
                     1. Tu base de datos usa el modelo 'Egresado' conectado a 'PerfilCV'.
                     2. Cuando te pregunten por habilidades o gente que sepa algo (ej: PHP, Java), usa SIEMPRE 'consultarEgresados'.
                     3. Si encuentras resultados, responde con una lista clara indicando nombre completo y programa del egresado.
                     4. Si no encuentras a nadie, sugiere buscar una habilidad similar o menos específica.
                     5. NUNCA respondas con un mensaje vacío; si la base de datos devuelve resultados, resúmelos profesionalmente.`,
            prompt: prompt,
            tools: tools,
            maxSteps: 5, // Permite ejecutar la herramienta y luego redactar la respuesta
        });

        // Log de depuración para Vercel
        console.log(`✅ Consulta procesada. Pasos de IA: ${steps.length}`);

        // Si la IA no generó texto pero sí ejecutó herramientas, forzamos un mensaje informativo
        const respuestaFinal = text || "He realizado la búsqueda en la base de datos, pero no he podido generar un resumen de los resultados encontrados.";

        res.json({ respuesta: respuestaFinal });

    } catch (error) {
        console.error("❌ Error en el flujo del Agente:", error);
        res.status(500).json({ 
            error: error.message,
            detalle: "Error interno al conectar Prisma con el Agente de IA"
        });
    }
};