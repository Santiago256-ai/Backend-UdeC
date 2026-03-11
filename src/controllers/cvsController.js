// En tu archivo controllers/cvsController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const guardarCV = async (req, res) => {
  try {
    const usuarioId = req.user.id; 
    const { personal, descripcion, habilidades, educacion, experiencia, idiomas, referencias } = req.body;

    // Función para quitar el ID temporal del frontend y dejar que la DB genere el suyo
    const prepararParaPrisma = (lista) => 
      lista.map(({ id, ...resto }) => resto);

    const perfil = await prisma.perfilCV.upsert({
      where: { usuarioId: usuarioId },
      update: {
        telefono: personal.telefono,
        email: personal.email,
        descripcion,
        habilidades,
        // Eliminamos lo viejo y creamos lo nuevo sin los IDs del frontend
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
    // Enviamos el mensaje real del error para depurar en el frontend si es necesario
    res.status(500).json({ error: error.message || "No se pudo guardar la información" });
  }
};