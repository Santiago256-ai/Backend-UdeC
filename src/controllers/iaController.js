import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../prismaClient.js';

// 1. PROVEEDOR LIMPIO
// Usamos tu API Key nueva y dejamos que Vercel use la ruta v1beta por defecto.
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// 2. HERRAMIENTAS (Tus herramientas están perfectas)
const tools = {
    consultarEgresados: tool({
        description: 'Busca egresados por habilidades técnicas o carrera.',
        parameters: z.object({
            filtro: z.string().describe('Habilidad o carrera a buscar (ej: React, Sistemas)')
        }),
        execute: async ({ filtro }) => {
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
        description: 'Obtiene el total de vacantes publicadas.',
        parameters: z.object({}),
        execute: async () => {
            const conteo = await prisma.vacante.count();
            return { totalVacantes: conteo };
        }
    })
};

// 3. CONTROLADOR
export const procesarConsultaAgente = async (req, res) => {
    try {
        const { prompt } = req.body;

        const result = await generateText({
            // LA CLAVE DEL ÉXITO: Cambiamos a la versión PRO. 
            // Es más potente y no tiene las restricciones regionales del Flash en la v1beta.
            model: google('gemini-1.5-pro'),
            
            system: `Eres el Asistente del Portal de Empleo de la Universidad de Cundinamarca (UdeC). Responde de forma amable, profesional y concisa.`,
            prompt: prompt,
            tools: tools,
            maxSteps: 5, 
        });

        res.json({ respuesta: result.text });

    } catch (error) {
        console.error("Error Crítico:", error);
        res.status(500).json({ error: error.message });
    }
};