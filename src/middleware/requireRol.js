// Deja pasar sólo a las sesiones con alguno de los roles indicados. Va siempre
// después de authMiddleware, que es quien deja el token verificado en req.user:
//
//     router.get("/perfil", authMiddleware, requireRol("egresado"), obtenerPerfilBase);
//
// Hace falta porque varios controladores usan req.user.id como id de egresado o de
// empresa sin mirar el rol, y los ids de las dos tablas se repiten.
export const requireRol = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user?.rol)) {
        return res.status(403).json({ error: "No tienes permiso para realizar esta acción." });
    }
    next();
};
