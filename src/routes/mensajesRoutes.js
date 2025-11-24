// backend/routes/mensajesRoutes.js

const express = require('express');
const router = express.Router();
const MensajeService = require('../services/MensajeService'); 

// Ruta para que la Empresa envíe un mensaje a un postulante
router.post('/empresa', async (req, res) => {
    // Los datos provienen del ChatSidebar: { senderId (empresaId), receiverId (postulanteId), content }
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
        return res.status(400).json({ error: 'Faltan datos requeridos (senderId, receiverId, content).' });
    }

    try {
        // Llamada al servicio que maneja la lógica de BD
        const resultado = await MensajeService.enviarMensajeEmpresa(senderId, receiverId, content);

        res.status(201).json({ 
            message: 'Mensaje enviado y notificación creada.', 
            data: resultado 
        });

    } catch (error) {
        console.error('Error al enviar mensaje desde la empresa:', error);
        // Devolvemos 500 si la base de datos o el servicio fallan
        res.status(500).json({ error: 'Fallo interno del servidor al procesar el mensaje.' });
    }
});

module.exports = router;