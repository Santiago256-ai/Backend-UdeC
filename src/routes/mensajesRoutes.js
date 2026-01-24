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

// 3. RESUMEN PARA EL DROPDOWN (CORREGIDO SEGÚN TU PRISMA)
router.get('/resumen/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        // Contamos mensajes donde el usuario es el RECEPTOR y no han sido leídos
        const countRes = await pool.query(
            'SELECT COUNT(*)::int FROM "Mensaje" WHERE "receiverId" = $1 AND "read" = FALSE',
            [usuarioId]
        );

        // Obtenemos los mensajes. Nota: Buscamos el nombre de la EMPRESA que envió el mensaje
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

// 4. MARCAR COMO LEÍDOS (CORREGIDO)
router.put('/leer/:usuarioId/:empresaId', async (req, res) => {
    const { usuarioId, empresaId } = req.params;
    try {
        // Marcamos como leídos los mensajes que envió esa empresa específica a este usuario
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