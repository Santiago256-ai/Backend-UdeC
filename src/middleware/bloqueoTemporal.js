// Contención (2026-10): las rutas del panel de administración (listados,
// estadísticas, ediciones, borrados y activar/desactivar cuentas) quedan
// deshabilitadas hasta que exista el rol de administrador. Las funciones de los
// controladores siguen ahí; para restaurarlas basta con volver a montarlas en
// la ruta, ya detrás de la verificación de rol.
export const bloqueoTemporal = (req, res) => {
    res.status(403).json({
        error: "Esta acción está deshabilitada temporalmente mientras se habilita el acceso de administrador."
    });
};
