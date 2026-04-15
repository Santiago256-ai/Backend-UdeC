import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../prismaClient.js';

// 1. CONFIGURACIÓN DEL PROVEEDOR
// Esto fuerza al SDK a usar tu API Key limpia.
const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    // TRUCO DE EMERGENCIA: Si el error de "v1beta" persiste, quita las barras "//" de la siguiente línea:
    // baseURL: 'https://generativelanguage.googleapis.com/v1',
});

// 2. DEFINICIÓN DE HERRAMIENTAS (TOOLS)
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

// 3. CONTROLADOR PRINCIPAL
export const procesarConsultaAgente = async (req, res) => {
    try {
        const { prompt } = req.body;

        const result = await generateText({
            // Usamos el ID exacto de la versión estable de producción
            model: google('gemini-1.5-flash-001'),
            
            // Instrucciones del sistema
            system: `Eres el Asistente del Portal de Empleo de la Universidad de Cundinamarca (UdeC).
                     Tu misión es ayudar a las empresas a analizar candidatos y ver estadísticas.
                     Responde de forma amable, profesional y concisa.
                     Si te preguntan por candidatos o vacantes, usa las herramientas disponibles.`,
            
            prompt: prompt,
            
            // Agregamos las herramientas y permitimos que la IA las llame hasta 5 veces por mensaje
            tools: tools,
            maxSteps: 5, 
        });

        // Enviamos la respuesta final generada por la IA
        res.json({ respuesta: result.text });

    } catch (error) {
        console.error("Error en el Agente IA:", error);
        
        // Mantenemos el error detallado para debuggear en el navegador si algo falla
        res.status(500).json({ 
            error: error.message, 
            stack: error.stack,
            detalle: "Fallo con el modelo gemini-1.5-flash-001" 
        });
    }
};