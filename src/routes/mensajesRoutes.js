import express from 'express';
import pool from '../database.js';
import MensajeService from '../services/MensajeService.js';

const router = express.Router();

// 1. OBTENER HISTORIAL (CORREGIDO: Ahora acepta vacanteId)
router.get('/historial/:usuarioId/:empresaId/:vacanteId', async (req, res) => {
    const { usuarioId, empresaId, vacanteId } = req.params;
    try {
        // Consultamos filtrando específicamente por la vacante para que no se mezclen los chats
        const query = `
            SELECT * FROM "Mensaje" 
            WHERE "vacanteId" = $3 
            AND (
                ("senderUsuarioId" = $1 AND "senderEmpresaId" IS NULL) OR 
                ("receiverId" = $1 AND "senderEmpresaId" = $2)
            )
            ORDER BY "fechaEnvio" ASC
        `;
        const result = await pool.query(query, [usuarioId, empresaId, vacanteId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener historial por vacante:', error);
        res.status(500).json({ error: 'Error al cargar el historial.' });
    }
});

// 2. ENVIAR MENSAJE (CORREGIDO: Ahora guarda vacanteId)
router.post('/enviar', async (req, res) => {
    const { senderId, receiverId, contenido, senderType, vacanteId } = req.body;
    try {
        // Usamos una consulta directa para asegurar que el vacanteId se guarde correctamente
        const query = `
            INSERT INTO "Mensaje" 
            (contenido, "senderType", "receiverId", "senderUsuarioId", "senderEmpresaId", "vacanteId", "read", "fechaEnvio") 
            VALUES ($1, $2, $3, $4, $5, $6, FALSE, NOW()) 
            RETURNING *
        `;

        const values = [
            contenido,
            senderType || 'USUARIO',
            parseInt(receiverId),
            senderType === 'USUARIO' ? parseInt(senderId) : null,
            senderType === 'EMPRESA' ? parseInt(senderId) : null,
            parseInt(vacanteId)
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al enviar mensaje con vacante:', error);
        res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
    }
});

// 3. CONTADORES
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

// 4. RESUMEN
router.get('/resumen/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const countRes = await pool.query(
            'SELECT COUNT(*)::int FROM "Mensaje" WHERE "receiverId" = $1 AND "read" = FALSE',
            [usuarioId]
        );

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

// 5. MARCAR COMO LEÍDOS
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