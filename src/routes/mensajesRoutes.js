import express from 'express';
import pool from '../database.js';
import MensajeService from '../services/MensajeService.js';

const router = express.Router();

// 1. OBTENER HISTORIAL (Sin cambios)
router.get('/historial/:usuarioId/:empresaId', async (req, res) => {
    const { usuarioId, empresaId } = req.params;
    try {
        const mensajes = await MensajeService.obtenerHistorial(pool, usuarioId, empresaId);
        res.json(mensajes);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al cargar el historial.' });
    }
});

// 2. ENVIAR MENSAJE
router.post('/enviar', async (req, res) => {
    const { senderId, receiverId, contenido, senderType } = req.body;
    try {
        const mensaje = await MensajeService.enviarMensajeEmpresa(pool, { 
            senderId, 
            receiverId, 
            contenido, 
            senderType: senderType || 'USUARIO' 
        });
        res.status(201).json(mensaje);
    } catch (error) {
        console.error('Error al enviar:', error);
        res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
    }
});

// 3. CONTADORES (Soluciona el Error 404 de VacantesDashboard.jsx)
// Tu frontend está buscando "/api/mensajeria/contadores/2", añadimos esta ruta
router.get('/contadores/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const query = 'SELECT COUNT(*)::int as "unreadMessages" FROM "Mensaje" WHERE "receiverId" = $1 AND "read" = FALSE';
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

// 4. RESUMEN (Soluciona el Error 500 de NotificationBadge.jsx)
router.get('/resumen/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const countRes = await pool.query(
            'SELECT COUNT(*)::int FROM "Mensaje" WHERE "receiverId" = $1 AND "read" = FALSE',
            [usuarioId]
        );

        // JOIN corregido: Buscamos en "Empresa" porque el usuario recibe mensajes de empresas
        const msgQuery = `
            SELECT m.id, m.contenido, m."senderEmpresaId" as "senderId", e.nombre as "senderNombre" 
            FROM "Mensaje" m 
            JOIN "Empresa" e ON m."senderEmpresaId" = e.id 
            WHERE m."receiverId" = $1 AND m."read" = FALSE 
            ORDER BY m."fechaEnvio" DESC LIMIT 5
        `;
        const msgRes = await pool.query(msgQuery, [usuarioId]);

        res.json({
            count: countRes.rows[0].count || 0,
            messages: msgRes.rows
        });
    } catch (error) {
        console.error('Error en resumen:', error);
        res.status(500).json({ error: 'Error interno: ' + error.message });
    }
});

// 5. MARCAR COMO LEÍDOS (Soluciona el Error 500 de Mensajeria.jsx)
router.put('/leer/:usuarioId/:empresaId', async (req, res) => {
    const { usuarioId, empresaId } = req.params;
    try {
        await pool.query(
            'UPDATE "Mensaje" SET "read" = TRUE WHERE "receiverId" = $1 AND "senderEmpresaId" = $2 AND "read" = FALSE',
            [usuarioId, empresaId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error al leer:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;