import express from 'express';
import pool from '../database.js'; // Asegúrate de que esta ruta a tu pool es correcta
import MensajeService from '../services/MensajeService.js'; // Importa el nuevo servicio

const router = express.Router();

// Ruta: POST /api/mensajes/empresa
// Objetivo: Enviar un mensaje de la Empresa a un Postulante
router.post('/empresa', async (req, res) => {
    // Los datos esperados son: { senderId (empresaId), receiverId (postulanteId), content }
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
        return res.status(400).json({ error: 'Faltan datos requeridos (senderId, receiverId, content).' });
    }

    try {
        // Llama al servicio que maneja la lógica de DB (transacción de pool)
        const resultado = await MensajeService.enviarMensajeEmpresa(pool, senderId, receiverId, content);

        res.status(201).json({ 
            message: 'Mensaje enviado y notificación creada.', 
            data: resultado 
        });

    } catch (error) {
        console.error('Error al enviar mensaje desde la empresa:', error);
        res.status(500).json({ error: 'Fallo interno del servidor al procesar el mensaje.', detalle: error.message });
    }
});

export default router;