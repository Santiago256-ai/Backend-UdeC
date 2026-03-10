const express = require('express');
const router = express.Router();
const cvsController = require('../controllers/cvsController');
// Asegúrate de importar tu middleware de autenticación (el nombre puede variar según tu proyecto)
const authMiddleware = require('../middleware/authMiddleware'); 

// Ruta para guardar o actualizar el CV
// El middleware 'authMiddleware' debe encargarse de verificar el token 
// y asignar el usuario a 'req.user'
// src/routes/cvsRoutes.js
router.post('/guardar', authMiddleware, cvsController.guardarCV);

module.exports = router;