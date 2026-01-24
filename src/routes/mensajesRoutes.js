import express from 'express';
import pool from '../database.js';
import MensajeService from '../services/MensajeService.js';

const router = express.Router();

// 1. OBTENER HISTORIAL: GET /api/mensajeria/historial/:usuarioId/:empresaId
router.get('/historial/:usuarioId/:empresaId', async (req, res) => {
    const { usuarioId, empresaId } = req.params;

    try {
        const mensajes = await MensajeService.obtenerHistorial(pool, usuarioId, empresaId);
        res.json(mensajes);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al cargar el historial de mensajes.' });
    }
});

// 2. ENVIAR MENSAJE: POST /api/mensajeria/enviar
router.post('/enviar', async (req, res) => {
    // El frontend envía: { senderId, senderType, receiverId, contenido }
    const { senderId, receiverId, contenido } = req.body;

    if (!senderId || !receiverId || !contenido) {
        return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    try {
        const resultado = await MensajeService.enviarMensajeEmpresa(
            pool, 
            senderId, 
            receiverId, 
            contenido
        );

        // Devolvemos solo el mensaje para que el frontend lo agregue a la lista
        res.status(201).json(resultado.mensaje);
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
    }
});

// Obtener conteo de mensajes no leídos para la empresa
router.get('/contadores-empresa/:empresaId', async (req, res) => {
    const { empresaId } = req.params;
    try {
        const query = `
            SELECT COUNT(*)::int as "unreadCount" 
            FROM "Mensaje" 
            WHERE "senderEmpresaId" = $1 AND "read" = FALSE AND "senderType" = 'USUARIO';
        `;
        const result = await pool.query(query, [empresaId]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener contadores' });
    }
});

export default router;