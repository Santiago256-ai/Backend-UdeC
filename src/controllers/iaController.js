import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../prismaClient.js';

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

export const procesarConsultaAgente = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await generateText({
      // MODIFICACIÓN AQUÍ:
      // Agregamos '-latest' para forzar la compatibilidad con la API Key de Google AI Studio
      // y evitar el error "not found for API version v1beta"
      model: google('gemini-1.5-flash-latest'), 
      
      system: `Eres el Asistente del Portal de Empleo UdeC. 
               Tu misión es ayudar a empresas y egresados a conectar.
               Usa la información de la base de datos de forma profesional.`,
      prompt: prompt,
      // tools: tools, // Déjalas comentadas solo en el primer deploy para probar conexión base
      maxSteps: 5,
    });

    res.json({ respuesta: result.text });
  } catch (error) {
    res.status(500).json({ 
        error: error.message, 
        stack: error.stack,
        detalle: "Error detectado por Gemini" 
    });
  }
};