// Validaciones comunes de las rutas del panel de administración.

// Id de la URL como entero positivo, o null (texto, decimales, "3abc"…). El
// controlador responde entonces el mismo 404 que para un registro inexistente.
export const idDeRuta = (valor) => {
    const id = /^\d+$/.test(valor ?? "") ? Number(valor) : NaN;
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

// Estados de cuenta de egresados y empresas (el login rechaza INACTIVO).
export const ESTADOS_CUENTA = ["ACTIVO", "INACTIVO"];
