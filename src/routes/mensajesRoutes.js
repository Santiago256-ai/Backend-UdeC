// backend/routes/mensajesRoutes.js

const express = require('express');
const router = express.Router();
// ⚡ Asegúrate que la ruta a tu servicio es correcta
const MensajeService = require('../services/MensajeService'); 

// Ruta para que la Empresa envíe un mensaje a un postulante
router.post('/empresa', async (req, res) => {
    // Los datos esperados desde el frontend son: { senderId (empresaId), receiverId (postulanteId), content }
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
        return res.status(400).json({ error: 'Faltan datos requeridos (senderId, receiverId, content).' });
    }

    try {
        // Llamada al servicio que maneja la lógica de BD (guardar mensaje y notificación)
        const resultado = await MensajeService.enviarMensajeEmpresa(senderId, receiverId, content);

        // Respuesta exitosa (201 Created)
        res.status(201).json({ 
            message: 'Mensaje enviado y notificación creada.', 
            data: resultado 
        });

    } catch (error) {
        console.error('Error al enviar mensaje desde la empresa:', error);
        // Si hay un error de DB o en el servicio, devolvemos 500
        res.status(500).json({ error: 'Fallo interno del servidor al procesar el mensaje.', detalle: error.message });
    }
});

module.exports = router;