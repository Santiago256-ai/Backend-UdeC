import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const upsertCV = async (req, res) => {
    try {
        const egresadoId = parseInt(req.params.egresadoId);
        const data = req.body;

        if (isNaN(egresadoId)) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        // --- LIMPIEZA Y MAPEADO SEGÚN SCHEMA.PRISMA ---
        
        const expLimpia = (data.experiencia || [])
            .filter(e => e.cargo && e.cargo.trim() !== "")
            .map(e => ({ 
                cargo: e.cargo, 
                empresa: e.empresa || "", 
                periodo: e.periodo || "" 
            }));

        const eduLimpia = (data.educacion || [])
            .filter(e => e.titulo && e.titulo.trim() !== "")
            .map(e => ({ 
                titulo: e.titulo, 
                institucion: e.institucion || "", 
                periodo: e.periodo || "" 
            }));

        // CORRECCIÓN AQUÍ: El modelo Referencia usa 'celular' no 'celular'
        const refLimpia = (data.referencias || [])
    .filter(r => r.nombre && r.nombre.trim() !== "")
    .map(r => ({ 
        nombre: r.nombre, 
        cargo: r.cargo || "", 
        celular: String(r.celular || "") // 👈 Aseguramos que nunca sea null/undefined
    }));

        const aptLimpia = (data.aptitudes || [])
            .filter(a => a.aptitud && a.aptitud.trim() !== "")
            .map(a => ({ 
                aptitud: a.aptitud 
            }));

        const idiLimpia = (data.idiomas || [])
            .filter(i => i.idioma && i.idioma.trim() !== "")
            .map(i => ({
                idioma: i.idioma,
                nivel: parseInt(i.nivel) || 0 
            }));

        const cvGuardado = await prisma.perfilCV.upsert({
            where: { egresadoId: egresadoId },
            update: {
                celular: data.celular || "",
                
                direccion: data.direccion || "",
                descripcion: data.descripcion || "",
                habilidades: data.habilidades || "",
                experiencia: { deleteMany: {}, create: expLimpia },
                educacion: { deleteMany: {}, create: eduLimpia },
                referencias: { deleteMany: {}, create: refLimpia },
                aptitudes: { deleteMany: {}, create: aptLimpia },
                idiomas: { deleteMany: {}, create: idiLimpia }
            },
            create: {
    egresadoId: egresadoId,
    celular: data.celular || "",
    
    direccion: data.direccion || "",
    descripcion: data.descripcion || "",
    habilidades: data.habilidades || "",
    // IMPORTANTE: Asegúrate de incluir las relaciones también en el create
    experiencia: { create: expLimpia },
    educacion: { create: eduLimpia },
    referencias: { create: refLimpia },
    aptitudes: { create: aptLimpia },
    idiomas: { create: idiLimpia }
}
        });

        res.status(200).json({ message: "CV guardado correctamente", cv: cvGuardado });
    } catch (error) {
        console.error("❌ ERROR EN PRISMA:", error);
        res.status(500).json({ 
            error: "Error interno del servidor al guardar el CV",
            detalle: error.message 
        });
    }
};

export const getCV = async (req, res) => {
    try {
        const egresadoId = parseInt(req.params.egresadoId);
        
        if (isNaN(egresadoId)) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        const cv = await prisma.perfilCV.findUnique({
            where: { egresadoId: egresadoId },
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