import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const upsertCV = async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const data = req.body;

        const cvGuardado = await prisma.perfilCV.upsert({
            where: {
                usuarioId: usuarioId,
            },
            update: {
                telefono: data.telefono,
                email: data.email,
                direccion: data.direccion,
                descripcion: data.descripcion,
                habilidades: data.habilidades,
                experiencia: {
                    deleteMany: {}, 
                    create: data.experiencia || []
                },
                educacion: {
                    deleteMany: {},
                    create: data.educacion || []
                }
            },
            create: {
                usuarioId: usuarioId,
                telefono: data.telefono,
                email: data.email,
                direccion: data.direccion,
                descripcion: data.descripcion,
                habilidades: data.habilidades,
                experiencia: {
                    create: data.experiencia || []
                },
                educacion: {
                    create: data.educacion || []
                }
            }
        });

        res.status(200).json({ message: "CV guardado correctamente", cv: cvGuardado });
    } catch (error) {
        console.error("Error al guardar CV:", error);
        res.status(500).json({ error: "Error interno del servidor al guardar el CV" });
    }
};

export const getCV = async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const cv = await prisma.perfilCV.findUnique({
            where: { usuarioId: usuarioId },
            include: {
                experiencia: true,
                educacion: true
            }
        });

        if (!cv) {
            return res.status(404).json({ message: "CV no encontrado" });
        }
        res.status(200).json(cv);
    } catch (error) {
        console.error("Error al obtener CV:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};