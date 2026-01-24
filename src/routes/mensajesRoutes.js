import express from 'express';
import pool from '../database.js';
import MensajeService from '../services/MensajeService.js';

const router = express.Router();

// 1. OBTENER HISTORIAL (Sin cambios, está bien)
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

// 2. ENVIAR MENSAJE (Corregido para el nuevo MensajeService)
router.post('/enviar', async (req, res) => {
    const { senderId, receiverId, contenido, senderType } = req.body;

    if (!senderId || !receiverId || !contenido) {
        return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    try {
        // Pasamos un objeto como espera el nuevo Service
        const mensaje = await MensajeService.enviarMensajeEmpresa(pool, { 
            senderId, 
            receiverId, 
            contenido, 
            senderType: senderType || 'USUARIO' // Por defecto USUARIO si no viene
        });

        // Devolvemos el mensaje directamente
        res.status(201).json(mensaje);
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
    }
});

// 3. CONTADORES (Corregido para que el Dashboard lo lea bien)
router.get('/contadores/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const query = `
            SELECT COUNT(*)::int as "unreadMessages" 
            FROM "Mensaje" 
            WHERE "receiverId" = $1 AND "read" = FALSE;
        `;
        const result = await pool.query(query, [usuarioId]);
        
        res.json({ 
            unreadMessages: result.rows[0].unreadMessages || 0,
            unreadNotifications: 0 
        });
    } catch (error) {
        console.error('Error en contadores:', error);
        res.status(500).json({ error: 'Error al obtener contadores' });
    }
});

export default router;