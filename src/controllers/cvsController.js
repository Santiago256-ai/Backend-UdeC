const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.guardarCV = async (req, res) => {
  // Obtenemos el userId del usuario autenticado (asumiendo que tu middleware de auth lo inyecta)
  const usuarioId = req.user.id; 
  const { descripcion, habilidades, educacion, experiencia, idiomas, referencias } = req.body;

  try {
    // Usamos 'upsert' para crear el perfil si no existe, o actualizarlo si ya existe
    const perfil = await prisma.perfilCV.upsert({
      where: { usuarioId: usuarioId },
      update: {
        descripcion,
        habilidades,
        // Limpiamos las relaciones anteriores y creamos las nuevas con los datos del form
        educacion: { deleteMany: {}, create: educacion },
        experiencia: { deleteMany: {}, create: experiencia },
        idiomas: { deleteMany: {}, create: idiomas },
        referencias: { deleteMany: {}, create: referencias },
      },
      create: {
        usuarioId: usuarioId,
        descripcion,
        habilidades,
        educacion: { create: educacion },
        experiencia: { create: experiencia },
        idiomas: { create: idiomas },
        referencias: { create: referencias },
      },
    });

    res.status(200).json({ message: "Hoja de vida guardada con éxito", data: perfil });
  } catch (error) {
    console.error("Error al guardar el CV:", error);
    res.status(500).json({ error: "No se pudo guardar la información del CV" });
  }
};