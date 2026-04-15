import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../prismaClient.js';

// ==========================================
// 1. HERRAMIENTAS (Intactas, funcionan perfecto)
// ==========================================
const tools = {
    consultarEgresados: tool({
        description: 'Obligatorio usar si el usuario menciona habilidades, tecnologías (PHP, React, Java), lenguajes, o carreras.',
        parameters: z.object({
            filtro: z.string().describe('Palabra clave a buscar (ej: PHP, Sistemas, Psicología).')
        }),
        execute: async ({ filtro }) => {
            console.log(`🔍 IA Buscando Egresados con filtro: ${filtro}`);
            const resultados = await prisma.egresado.findMany({
                where: {
                    estado: 'ACTIVO',
                    OR: [
                        { nombres: { contains: filtro, mode: 'insensitive' } },
                        { programa: { contains: filtro, mode: 'insensitive' } },
                        { cv: { OR: [ { habilidades: { contains: filtro, mode: 'insensitive' } } ] } }
                    ]
                },
                select: { nombres: true, apellidos: true, correo: true, programa: true }
            });
            
            if (resultados.length === 0) return `No se encontraron egresados que coincidan con "${filtro}".`;
            const lista = resultados.map(r => `• ${r.nombres} ${r.apellidos} | Programa: ${r.programa} | Contacto: ${r.correo}`).join('\n');
            return `Encontré ${resultados.length} egresados con la habilidad o programa "${filtro}":\n\n${lista}`;
        }
    }),

    contarPostulacionesVacante: tool({
        description: 'Obligatorio usar si el usuario pide la cantidad de postulaciones, candidatos o aplicantes a una vacante específica.',
        parameters: z.object({
            tituloVacante: z.string().describe('El título de la vacante, ej: Psicólogo en domicilio')
        }),
        execute: async ({ tituloVacante }) => {
            console.log(`🔍 IA Buscando Vacante: ${tituloVacante}`);
            const vacante = await prisma.vacante.findFirst({
                where: { titulo: { contains: tituloVacante, mode: 'insensitive' } },
                include: { _count: { select: { postulaciones: true } } }
            });

            if (!vacante) return `No se encontró ninguna vacante con el título "${tituloVacante}".`;
            return `La vacante "${vacante.titulo}" tiene exactamente ${vacante._count.postulaciones} postulaciones actualmente.`;
        }
    }),

    verEstadisticasGlobales: tool({
        description: 'Obligatorio usar si piden el total de vacantes abiertas en general.',
        parameters: z.object({}),
        execute: async () => {
            console.log(`🔍 IA Consultando total de vacantes abiertas`);
            const total = await prisma.vacante.count({ where: { estado: 'ABIERTA' } });
            return `Actualmente el portal cuenta con un total de ${total} vacantes ABIERTAS.`;
        }
    })
};

// ==========================================
// 2. CONTROLADOR (Con System Prompt Autoritario)
// ==========================================
export const procesarConsultaAgente = async (req, res) => {
    try {
        const { prompt } = req.body;

        const { text, steps } = await generateText({
            model: google('gemini-2.5-flash'),
            // 🔥 AQUÍ ESTÁ LA MAGIA: Le quitamos la opción de dudar
            system: `Eres el Asistente Experto del Portal de Empleo UdeC.
                     
¡TIENES HERRAMIENTAS DE BASE DE DATOS! ESTÁ ESTRICTAMENTE PROHIBIDO DECIR "NO TENGO UNA HERRAMIENTA" O "NO PUEDO".

Tus herramientas son:
1. 'contarPostulacionesVacante': Úsala SIEMPRE que pregunten por postulaciones a una vacante específica.
2. 'consultarEgresados': Úsala SIEMPRE que pregunten por habilidades o egresados.
3. 'verEstadisticasGlobales': Úsala para totales generales.

REGLA DE ORO: Si recibes una pregunta, USA LA HERRAMIENTA CORRESPONDIENTE INMEDIATAMENTE. No te disculpes. Si la herramienta devuelve un texto, cópialo exactamente como tu respuesta final al usuario.`,
            prompt: prompt,
            tools: tools,
            maxSteps: 5,
        });

        console.log(`🤖 Agente IA terminó su proceso en ${steps?.length || 1} paso(s).`);

        let respuestaFinal = text;

        // 🛡️ EL SALVAVIDAS
        if (!respuestaFinal || respuestaFinal.trim() === "") {
            console.log("⚠️ La IA se quedó callada. Activando el salvavidas...");
            const resultadosHerramientas = steps.flatMap(s => s.toolResults || []);
            
            if (resultadosHerramientas.length > 0) {
                respuestaFinal = resultadosHerramientas.map(tr => tr.result).join('\n\n');
            } else {
                respuestaFinal = "Procesé tu consulta pero no encontré datos específicos en la base de datos.";
            }
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