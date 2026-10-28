// Apoyo común para las pruebas de contención: el simulador de Prisma y los
// tokens de prueba. El simulador devuelve sólo lo que la consulta pide (select /
// include), igual que Prisma: si alguien vuelve a pedir el registro entero, las
// pruebas lo ven. El secreto de los tokens viene de vitest.config.js.
import jwt from 'jsonwebtoken';

const RELACIONES = new Set([
  'empresa', 'vacante', 'vacantes', 'postulaciones', 'egresado', 'cv',
  'educacion', 'experiencia', 'aptitudes', 'idiomas', 'referencias', '_count',
  'postulacion', 'mensaje',
]);
// (dentro de _count las "relaciones" son números: se tratan como escalares)
const esRelacion = (fila, k) => RELACIONES.has(k) && typeof fila[k] === 'object' && fila[k] !== null;

export const proyectar = (fila, { select, include } = {}) => {
  if (Array.isArray(fila)) return fila.map((f) => proyectar(f, { select, include }));
  if (select) {
    return Object.fromEntries(Object.entries(select).filter(([, v]) => v)
      .map(([k, v]) => [k, v === true ? (esRelacion(fila, k) ? proyectar(fila[k]) : fila[k]) : proyectar(fila[k], v)]));
  }
  const salida = Object.fromEntries(Object.entries(fila).filter(([k]) => !esRelacion(fila, k)));
  for (const [k, v] of Object.entries(include || {})) {
    if (v) salida[k] = proyectar(fila[k], v === true ? {} : v);
  }
  return salida;
};

export const PROHIBIDOS = ['password', 'resetToken', 'resetTokenExpiry', 'firebaseUid'];
export const sinCampos = (obj, campos) => campos.filter((c) => c in obj);

export const firmar = (payload) => `Bearer ${jwt.sign(payload, process.env.JWT_SECRET)}`;
export const EMPRESA_DUENA = () => firmar({ id: 3, rol: 'empresa' });
export const OTRA_EMPRESA = () => firmar({ id: 4, rol: 'empresa' });
export const EGRESADO_MISMO_ID = () => firmar({ id: 3, rol: 'egresado' }); // mismo id numérico que la empresa
// Token de administrador como lo emite POST /api/auth/admin/login: sub + aud, sin id.
export const firmarAdmin = (payload = {}, opciones = {}) => `Bearer ${jwt.sign(
  { rol: 'admin', ...payload }, process.env.JWT_SECRET,
  { subject: '1', audience: 'admin', expiresIn: '2h', ...opciones })}`;
export const TOKEN_ADMIN = () => firmarAdmin();

// Egresado completo, como lo guarda la base (con secretos y CV).
export const egresadoCompleto = (id = 7) => ({
  id, nombres: 'Laura', apellidos: 'Gómez', correo: 'laura@ejemplo.com', celular: '3000000000',
  facultad: 'Ingeniería', programa: 'Sistemas', estado: 'ACTIVO', createdAt: new Date('2026-01-01'),
  password: 'hash', resetToken: 'token-vigente', resetTokenExpiry: new Date(), firebaseUid: 'uid',
  cv: {
    id: 1, egresadoId: id, celular: '3000000000', facultad: 'Ingeniería', programa: 'Sistemas',
    descripcion: 'Perfil', direccion: 'Calle 1', habilidades: ['Excel'],
    educacion: [{ id: 1, titulo: 'Ingeniería de Sistemas', institucion: 'UdeC', periodo: '2020-2025', perfilId: 1 }],
    experiencia: [{ id: 1, cargo: 'Practicante', empresa: 'Agro Andes', periodo: '2025', perfilId: 1 }],
    aptitudes: [{ id: 1, aptitud: 'Liderazgo', perfilCVId: 1 }],
    idiomas: [{ id: 1, idioma: 'Inglés', nivel: 3, perfilCVId: 1 }],
    referencias: [{ id: 1, nombre: 'Pedro', cargo: 'Jefe', celular: '3100000000', perfilId: 1 }],
  },
});

// Postulación completa, con los campos que la empresa no debe recibir sin necesidad.
export const postulacionCompleta = ({ id = 11, vacanteId = 5, egresadoId = 7 } = {}) => ({
  id, telefono: '3000000000', estado: 'PENDIENTE', anclado: false, chatActivo: true,
  fecha: new Date('2026-02-01'), fechaActualizacion: new Date('2026-02-02'),
  calificacionAdmin: 4, comentarioAdmin: 'nota interna', vacanteId, egresadoId,
  egresado: egresadoCompleto(egresadoId),
  vacante: { id: vacanteId, titulo: 'Analista', empresaId: 3, estado: 'ABIERTA', salario: '2000000' },
});

// Notificación de empresa completa, con sus relaciones (la postulación entera).
export const notificacionEmpresaCompleta = ({ id = 21, empresaId = 3, egresadoId = 7 } = {}) => ({
  id, tipo: 'POSTULACION', contenido: 'Laura Gómez se postuló a Analista', fecha: new Date('2026-02-01'),
  vista: false, referenciaId: 5, mensajeId: null, postulacionId: 11, egresadoId, empresaId,
  egresado: egresadoCompleto(egresadoId),
  postulacion: postulacionCompleta({ egresadoId }),
  mensaje: null,
});
