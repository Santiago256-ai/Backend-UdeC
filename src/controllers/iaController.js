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

        // Usamos generateText con un manejo más robusto de los pasos
        const { text, steps } = await generateText({
            model: google('gemini-2.5-flash'),
            system: `Eres el Analista del Portal de Empleo UdeC. 
                     Tu misión es buscar en la base de datos y RESPONDER con los resultados.
                     Si encuentras personas, haz una lista con sus nombres y correos.
                     Si no encuentras a nadie, dilo claramente.
                     NUNCA respondas con un mensaje vacío.`,
            prompt: prompt,
            tools: tools,
            maxSteps: 5,
        });

        // Log en la consola de Vercel para que veas qué herramientas se usaron
        console.log("Pasos ejecutados por la IA:", steps.length);

        // Si por alguna razón 'text' llega vacío pero hubo herramientas, 
        // significa que la IA leyó los datos pero no los resumió.
        const respuestaFinal = text || "He consultado la base de datos pero no encontré resultados que coincidan con tu búsqueda.";

        res.json({ respuesta: respuestaFinal });

    } catch (error) {
        console.error("Error en el flujo del Agente:", error);
        res.status(500).json({ error: error.message });
    }
};