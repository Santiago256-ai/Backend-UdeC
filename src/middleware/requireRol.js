import prisma from "../prismaClient.js";

// Deja pasar sólo a las sesiones con alguno de los roles indicados. Va siempre
// después de authMiddleware, que es quien deja el token verificado en req.user:
//
//     router.get("/perfil", authMiddleware, requireRol("egresado"), obtenerPerfilBase);
//
// Hace falta porque varios controladores usan req.user.id como id de egresado o de
// empresa sin mirar el rol, y los ids de las dos tablas se repiten.
//
// requireRol("admin") exige además el token que emite POST /api/auth/admin/login
// (aud "admin", sub = id del Administrador) y comprueba en cada petición que la
// cuenta exista y siga activa: desactivarla corta el acceso sin esperar a que el
// token venza. Deja la cuenta en req.admin ({ id, usuario, nombre }).
// Los tokens con aud "admin" no valen para ningún otro rol.

const NEGADO = { error: "No tienes permiso para realizar esta acción." };

const esTokenDeAdmin = (usuario) =>
    usuario?.aud === "admin" || (Array.isArray(usuario?.aud) && usuario.aud.includes("admin"));

export const requireRol = (...roles) => async (req, res, next) => {
    const usuario = req.user;
    if (!roles.includes(usuario?.rol)) {
        return res.status(403).json(NEGADO);
    }

    if (usuario.rol !== "admin") {
        if (esTokenDeAdmin(usuario)) return res.status(403).json(NEGADO);
        return next();
    }

    const id = /^\d+$/.test(usuario.sub ?? "") ? Number(usuario.sub) : NaN;
    if (usuario.aud !== "admin" || !Number.isSafeInteger(id) || id <= 0) {
        return res.status(403).json(NEGADO);
    }

    try {
        const admin = await prisma.administrador.findUnique({
            where: { id },
            select: { id: true, usuario: true, nombre: true, activo: true }
        });
        if (!admin?.activo) return res.status(403).json(NEGADO);

        req.admin = { id: admin.id, usuario: admin.usuario, nombre: admin.nombre };
        next();
    } catch (error) {
        console.error("Error al verificar la cuenta de administrador:", error.message);
        res.status(500).json({ error: "No se pudo verificar la sesión. Intenta de nuevo." });
    }
};
