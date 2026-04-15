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

// ... otros imports

export const procesarConsultaAgente = async (req, res) => {
  try {
    const { prompt } = req.body;

    const result = await generateText({
      // CAMBIO CLAVE: Usa este ID de modelo específico 
      // y asegúrate de que no haya espacios extras.
      model: google('models/gemini-1.5-flash-latest'), 
      
      system: `Eres el Asistente del Portal de Empleo UdeC...`,
      prompt: prompt,
      // ... resto de tu config
    });

    res.json({ respuesta: result.text });
    
  } catch (error) {
    // Si vuelve a fallar con el mismo error, intentaremos la "Opción B"
    res.status(500).json({ 
        error: error.message, 
        stack: error.stack,
        detalle: "Error persistente en la versión de la API" 
    });
  }
};