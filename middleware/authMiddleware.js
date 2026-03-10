import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_universidad_cundinamarca_2024';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Acceso denegado. No se proporcionó token.' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: { id: true, nombre: true, correo: true, rol: true }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // OJO: Aquí lo guardamos en req.user para que el controlador lo encuentre
    req.user = usuario; 
    next();
    
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(401).json({ success: false, error: 'Token no válido' });
  }
};

// Middlewares de roles exportados individualmente
export const requireRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: `Acceso denegado.`
      });
    }
    next();
  };
};

export const requireEstudiante = requireRol(['estudiante']);
export const requireEmpresa = requireRol(['empresa']);