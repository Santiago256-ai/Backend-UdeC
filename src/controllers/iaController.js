import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../prismaClient.js';

// ==========================================
// 1. HERRAMIENTAS (Transforman los datos a TEXTO HUMANO)
// ==========================================
const tools = {
    // HERRAMIENTA A: Buscar Egresados por Habilidad/Carrera
    consultarEgresados: tool({
        description: 'Usa esta herramienta cuando te pregunten por candidatos, egresados o personas con habilidades (ej: PHP, React) o de un programa.',
        parameters: z.object({
            filtro: z.string().describe('Palabra clave a buscar: habilidad, tecnología, o nombre de la carrera.')
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
            
            // 🔥 TRUCO: Formateamos el texto aquí mismo para que la IA no tenga que pensar
            if (resultados.length === 0) return `No se encontraron egresados que coincidan con "${filtro}".`;
            const lista = resultados.map(r => `• ${r.nombres} ${r.apellidos} | Programa: ${r.programa} | Contacto: ${r.correo}`).join('\n');
            return `Encontré ${resultados.length} egresados con la habilidad o programa "${filtro}":\n\n${lista}`;
        }
    }),

    // HERRAMIENTA B: Ver Postulaciones de una Vacante Específica
    contarPostulacionesVacante: tool({
        description: 'Usa esta herramienta cuando te pregunten cuántas personas se han postulado a una vacante específica.',
        parameters: z.object({
            tituloVacante: z.string().describe('El título de la vacante, ej: Psicólogo')
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

    // HERRAMIENTA C: Estadísticas Generales
    verEstadisticasGlobales: tool({
        description: 'Usa esta herramienta si te preguntan cuántas vacantes u ofertas hay publicadas en total.',
        parameters: z.object({}),
        execute: async () => {
            console.log(`🔍 IA Consultando total de vacantes abiertas`);
            const total = await prisma.vacante.count({ where: { estado: 'ABIERTA' } });
            return `Actualmente el portal cuenta con un total de ${total} vacantes ABIERTAS.`;
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
            system: `Eres el Asistente del Portal de Empleo UdeC.
                     Obligatorio: Cuando uses una herramienta, simplemente repite exactamente la información que la herramienta te devolvió, sin alterar los datos. Si la herramienta te da una lista, muéstrala tal cual.`,
            prompt: prompt,
            tools: tools,
            maxSteps: 5,
        });

        console.log(`🤖 Agente IA terminó su proceso en ${steps?.length || 1} paso(s).`);

        let respuestaFinal = text;

        // 🛡️ EL SALVAVIDAS FINAL: Si el texto está vacío, extraemos el texto que nosotros mismos fabricamos en las tools
        if (!respuestaFinal || respuestaFinal.trim() === "") {
            console.log("⚠️ La IA se quedó callada. Activando el salvavidas...");
            
            // Extraemos los resultados de las herramientas que se usaron en los 'steps'
            const resultadosHerramientas = steps.flatMap(s => s.toolResults || []);
            
            if (resultadosHerramientas.length > 0) {
                // Unimos las oraciones limpias que nuestras tools generaron
                respuestaFinal = resultadosHerramientas.map(tr => tr.result).join('\n\n');
            } else {
                respuestaFinal = "He procesado tu solicitud, pero no encontré datos específicos en la base de datos.";
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