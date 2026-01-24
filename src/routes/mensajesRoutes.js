import express from 'express';
import pool from '../database.js';
import MensajeService from '../services/MensajeService.js';

const router = express.Router();

// 1. OBTENER HISTORIAL
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

// 2. ENVIAR MENSAJE
router.post('/enviar', async (req, res) => {
    const { senderId, receiverId, contenido, senderType } = req.body;

    if (!senderId || !receiverId || !contenido) {
        return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    try {
        const mensaje = await MensajeService.enviarMensajeEmpresa(pool, { 
            senderId, 
            receiverId, 
            contenido, 
            senderType: senderType || 'USUARIO' 
        });
        res.status(201).json(mensaje);
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
    }
});

// 3. CONTADORES (Solo el número)
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

// ⚡ 4. RESUMEN PARA EL DROPDOWN (NUEVO)
// Este es el que usa el NotificationBadge para mostrar la lista tipo Facebook
router.get('/resumen/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        // Obtenemos el conteo
        const countQuery = 'SELECT COUNT(*)::int FROM "Mensaje" WHERE "receiverId" = $1 AND "read" = FALSE';
        const countRes = await pool.query(countQuery, [usuarioId]);

        // Obtenemos los últimos 5 mensajes no leídos con el nombre de quien envía
        const msgQuery = `
            SELECT m.id, m.contenido, m."senderId", u.nombre as "senderNombre" 
            FROM "Mensaje" m 
            JOIN "Usuario" u ON m."senderId" = u.id 
            WHERE m."receiverId" = $1 AND m."read" = FALSE 
            ORDER BY m."fechaEnvio" DESC LIMIT 5
        `;
        const msgRes = await pool.query(msgQuery, [usuarioId]);

        res.json({
            count: countRes.rows[0].count || 0,
            messages: msgRes.rows
        });
    } catch (error) {
        console.error('Error al obtener resumen:', error);
        res.status(500).json({ error: 'Error al obtener resumen de mensajes' });
    }
});

// ⚡ 5. MARCAR COMO LEÍDOS (NUEVO)
// Se llama cuando el usuario entra al chat para que el contador baje a 0
router.put('/leer/:usuarioId/:senderId', async (req, res) => {
    const { usuarioId, senderId } = req.params;
    try {
        await pool.query(
            'UPDATE "Mensaje" SET "read" = TRUE WHERE "receiverId" = $1 AND "senderId" = $2',
            [usuarioId, senderId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error al marcar como leído:', error);
        res.status(500).json({ error: 'Error al actualizar estado de mensajes' });
    }
});

export default router;