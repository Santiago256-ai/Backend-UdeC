import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import prisma from '../prismaClient.js';

// ==========================================
// 1. HERRAMIENTAS (Retornan TEXTO DIRECTO)
// ==========================================
const tools = {
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
            
            if (resultados.length === 0) return `No se encontraron egresados que coincidan con "${filtro}".`;
            const lista = resultados.map(r => `• ${r.nombres} ${r.apellidos} | Programa: ${r.programa} | Contacto: ${r.correo}`).join('\n');
            return `Encontré ${resultados.length} egresados con la habilidad o programa "${filtro}":\n\n${lista}`;
        }
    }),

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
// 2. CONTROLADOR (Extracción Directa)
// ==========================================
export const procesarConsultaAgente = async (req, res) => {
    try {
        const { prompt } = req.body;

        // EXTRAEMOS toolResults DIRECTAMENTE DE LA RAÍZ
        const { text, toolResults } = await generateText({
            model: google('gemini-2.5-flash'),
            system: `Eres el Asistente del Portal de Empleo UdeC.
                     Si usas una herramienta, muestra la información al usuario de forma amable.`,
            prompt: prompt,
            tools: tools,
            maxSteps: 5,
        });

        // 1. Asumimos que la IA hizo bien su trabajo y generó texto
        let respuestaFinal = text;

        // 2. Si la IA se quedó en blanco (el bug de Vercel SDK)...
        if (!respuestaFinal || respuestaFinal.trim() === "") {
            
            // ...vamos directo a la raíz de toolResults (donde están los textos de Prisma)
            if (toolResults && toolResults.length > 0) {
                console.log("⚠️ Extrayendo resultado directo de Prisma...");
                // Tomamos el string exacto que construimos arriba en las tools
                respuestaFinal = toolResults[0].result;
            } else {
                respuestaFinal = "Procesé tu consulta pero no encontré datos en el sistema.";
            }
        }

        res.json({ respuesta: respuestaFinal });

    } catch (error) {
        console.error("❌ ERROR EN IA:", error);
        res.status(500).json({ error: "Hubo un error de conexión con la IA.", detalle: error.message });
    }
};