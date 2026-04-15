import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../utils/prismaClient.js'; // Usamos tu cliente ya configurado

// Definimos las "herramientas" que Gemini puede usar
const tools = {
  consultarEgresados: tool({
    description: 'Busca egresados por habilidades técnicas o carrera.',
    parameters: z.object({
      filtro: z.string().describe('Habilidad o carrera a buscar (ej: React, Sistemas)')
    }),
    execute: async ({ filtro }) => {
      return await prisma.estudiante.findMany({ // Ajustado a tu controlador estudianteController
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

export const procesarConsultaAgente = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await generateText({
      model: google('gemini-1.5-flash'), // Versión gratuita y rápida
      system: `Eres el Agente de IA del Portal de Empleo UdeC. 
               Tu objetivo es ayudar a empresas a encontrar egresados de la Universidad de Cundinamarca.
               Usa un tono profesional y amable. Solo usa las herramientas disponibles.`,
      tools: tools,
      maxSteps: 5, // Permite que la IA use herramientas y luego responda
      prompt: prompt,
    });

    res.json({ respuesta: result.text });
  } catch (error) {
    console.error("Error en Agente IA:", error);
    res.status(500).json({ error: "El agente no pudo procesar la solicitud" });
  }
};