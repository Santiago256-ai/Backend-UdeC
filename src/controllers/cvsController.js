import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// --- FUNCIÓN PARA GUARDAR (YA CORREGIDA) ---
export const guardarCV = async (req, res) => {
  try {
    const usuarioId = req.user.id; 
    const { personal, descripcion, habilidades, educacion, experiencia, idiomas, referencias } = req.body;

    const prepararParaPrisma = (lista) => 
      lista.map(({ id, perfilId, ...resto }) => resto);

    const perfil = await prisma.perfilCV.upsert({
      where: { usuarioId: usuarioId },
      update: {
        telefono: personal.telefono,
        email: personal.email,
        descripcion,
        habilidades,
        educacion: { deleteMany: {}, create: prepararParaPrisma(educacion) },
        experiencia: { deleteMany: {}, create: prepararParaPrisma(experiencia) },
        idiomas: { deleteMany: {}, create: prepararParaPrisma(idiomas) },
        referencias: { deleteMany: {}, create: prepararParaPrisma(referencias) },
      },
      create: {
        usuarioId: usuarioId,
        telefono: personal.telefono,
        email: personal.email,
        descripcion,
        habilidades,
        educacion: { create: prepararParaPrisma(educacion) },
        experiencia: { create: prepararParaPrisma(experiencia) },
        idiomas: { create: prepararParaPrisma(idiomas) },
        referencias: { create: prepararParaPrisma(referencias) },
      },
    });

    res.status(200).json({ message: "Hoja de vida guardada con éxito", data: perfil });
  } catch (error) {
    console.error("Error al guardar el CV:", error);
    res.status(500).json({ error: error.message || "No se pudo guardar la información" });
  }
};

// --- NUEVA FUNCIÓN PARA RECUPERAR (PARA EL useEffect) ---
export const obtenerMiCV = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const cv = await prisma.perfilCV.findUnique({
      where: { usuarioId: usuarioId },
      include: {
        educacion: true,
        experiencia: true,
        idiomas: true,
        referencias: true,
      },
    });

    if (!cv) {
      return res.status(200).json(null); // No hay error, solo no tiene CV aún
    }

    res.status(200).json(cv);
  } catch (error) {
    console.error("Error al obtener CV:", error);
    res.status(500).json({ error: "Error al obtener la información" });
  }
};