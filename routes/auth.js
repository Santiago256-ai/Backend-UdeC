// routes/
const express = require('express');
const { register, login, getPerfil } = require('../controllers/authController');
const { authMiddleware, requireEstudiante, requireEmpresa, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
router.post('/register', register);

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// @desc    Obtener perfil del usuario actual
// @route   GET /api/auth/perfil
// @access  Private (todos los usuarios autenticados)
router.get('/perfil', authMiddleware, getPerfil);

// @desc    Ruta protegida solo para estudiantes
// @route   GET /api/auth/estudiante
// @access  Private (solo estudiantes)
router.get('/estudiante', authMiddleware, requireEstudiante, (req, res) => {
  res.json({
    success: true,
    message: '🔐 Acceso permitido - Ruta para estudiantes',
    usuario: req.usuario
  });
});

// @desc    Ruta protegida solo para empresas
// @route   GET /api/auth/empresa
// @access  Private (solo empresas)
router.get('/empresa', authMiddleware, requireEmpresa, (req, res) => {
  res.json({
    success: true,
    message: '🏢 Acceso permitido - Ruta para empresas',
    usuario: req.usuario
  });
});

// @desc    Ruta protegida solo para administradores
// @route   GET /api/auth/admin
// @access  Private (solo admin)
router.get('/admin', authMiddleware, requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: '⚙️ Acceso permitido - Ruta para administradores',
    usuario: req.usuario
  });
});

// @desc    Verificar estado del token
// @route   GET /api/auth/verify
// @access  Private
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: '✅ Token válido',
    usuario: req.usuario
  });
});

module.exports = router;