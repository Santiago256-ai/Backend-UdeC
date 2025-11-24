// server.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Importar rutas
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba para verificar que funciona
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API del Portal de Empleo Universitario - Cundinamarca',
    status: 'Funcionando correctamente',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        perfil: 'GET /api/auth/perfil (protegido)',
        verify: 'GET /api/auth/verify (protegido)'
      },
      test: '/api/test'
    }
  });
});

// Ruta de prueba con base de datos
app.get('/api/test', async (req, res) => {
  try {
    const usuariosCount = await prisma.usuario.count();
    res.json({
      message: '✅ Conexión a la base de datos exitosa',
      totalUsuarios: usuariosCount,
      database: 'PostgreSQL - job_portal'
    });
  } catch (error) {
    res.status(500).json({
      error: '❌ Error conectando a la base de datos',
      detalle: error.message
    });
  }
});

// Manejo de rutas no encontradas - CORREGIDO
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('❌ Error global:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 Portal de Empleo Universitario');
  console.log('📊 Universidad de Cundinamarca');
  console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
  console.log('=================================');
});