import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const upsertCV = async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.usuarioId);
        const data = req.body;

        // Limpieza de datos: Filtramos los objetos vacíos antes de enviarlos a Prisma
        const expLimpia = (data.experiencia || []).filter(e => e.cargo && e.cargo.trim() !== "");
        const eduLimpia = (data.educacion || []).filter(e => e.titulo && e.titulo.trim() !== "");
        const refLimpia = (data.referencias || []).filter(r => r.nombre && r.nombre.trim() !== "");
        const aptLimpia = (data.aptitudes || []).filter(a => a.aptitud && a.aptitud.trim() !== "");
        // Convertimos el nivel a número entero para que coincida con el schema
        const idiLimpia = (data.idiomas || []).filter(i => i.idioma && i.idioma.trim() !== "").map(i => ({
            idioma: i.idioma,
            nivel: parseInt(i.nivel) || 0
        }));

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
                    create: expLimpia
                },
                educacion: {
                    deleteMany: {},
                    create: eduLimpia
                },
                referencias: {
                    deleteMany: {},
                    create: refLimpia
                },
                aptitudes: {
                    deleteMany: {},
                    create: aptLimpia
                },
                idiomas: {
                    deleteMany: {},
                    create: idiLimpia
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
                    create: expLimpia
                },
                educacion: {
                    create: eduLimpia
                },
                referencias: {
                    create: refLimpia
                },
                aptitudes: {
                    create: aptLimpia
                },
                idiomas: {
                    create: idiLimpia
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
                educacion: true,
                referencias: true,
                aptitudes: true,
                idiomas: true
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