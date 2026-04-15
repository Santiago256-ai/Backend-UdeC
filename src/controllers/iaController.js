import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../prismaClient.js';

// 1. DEFINICIÓN DE HERRAMIENTAS (TOOLS) MEJORADAS
const tools = {
    consultarEgresados: tool({
        // Descripción proactiva para que la IA sepa que TIENE que usarla
        description: 'Obligatorio usar esta herramienta para buscar egresados por habilidades técnicas, lenguajes de programación (como PHP, React, Python) o por el nombre de su carrera profesional.',
        parameters: z.object({
            filtro: z.string().describe('La habilidad técnica, lenguaje o carrera a buscar en la base de datos.')
        }),
        execute: async ({ filtro }) => {
            console.log(`🔍 Agente consultando base de datos por: ${filtro}`);
            return await prisma.estudiante.findMany({
                where: {
                    OR: [
                        { habilidades: { contains: filtro, mode: 'insensitive' } },
                        { carrera: { contains: filtro, mode: 'insensitive' } }
                    ],
                    estado: 'ACTIVO'
                },
                select: { nombre: true, carrera: true, habilidades: true, email: true }
            });
        }
    }),

    verEstadisticasVacantes: tool({
        description: 'Proporciona el número total de ofertas de empleo o vacantes publicadas actualmente.',
        parameters: z.object({}),
        execute: async () => {
            const conteo = await prisma.vacante.count();
            return { totalVacantes: conteo };
        }
    })
};

// 2. CONTROLADOR PRINCIPAL CON SYSTEM PROMPT REFORZADO
export const procesarConsultaAgente = async (req, res) => {
    try {
        const { prompt } = req.body;

        const result = await generateText({
            model: google('gemini-2.5-flash'),
            
            // System Prompt "PRO" para evitar que la IA se excuse
            system: `Eres el Analista Inteligente del Portal de Empleo de la Universidad de Cundinamarca (UdeC).
                     
                     Tus reglas de comportamiento son:
                     1. Tienes acceso directo a la base de datos mediante tus herramientas. NUNCA digas que no puedes filtrar o buscar egresados.
                     2. Si un usuario pregunta por una habilidad (ej: "quién sabe PHP"), usa inmediatamente 'consultarEgresados'.
                     3. Si no encuentras resultados tras usar la herramienta, responde: "No encontré egresados con esa habilidad específica, pero puedo ayudarte a buscar otros perfiles similares".
                     4. Tus respuestas deben ser profesionales, concisas y orientadas a ayudar a la empresa a reclutar talento.
                     5. Habla siempre en nombre de la UdeC de manera institucional.`,
            
            prompt: prompt,
            tools: tools,
            maxSteps: 5, // Crucial para que la IA procese la respuesta de la DB y la redacte
        });

        // Enviamos la respuesta generada (que ya incluye el análisis de los datos de la tool)
        res.json({ respuesta: result.text });

    } catch (error) {
        console.error("Error en el Agente IA:", error);
        res.status(500).json({ 
            error: error.message, 
            detalle: "Error en el flujo de pensamiento del agente" 
        });
    }
};