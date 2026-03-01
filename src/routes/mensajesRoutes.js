import express from 'express';
import pool from '../database.js';
import MensajeService from '../services/MensajeService.js';

const router = express.Router();

// 1. OBTENER HISTORIAL (CORREGIDO: Ahora acepta vacanteId)
router.get('/historial/:usuarioId/:empresaId/:vacanteId', async (req, res) => {
    const { usuarioId, empresaId, vacanteId } = req.params;
    try {
        const statusQuery = 'SELECT "chatActivo" FROM "Postulacion" WHERE "usuarioId" = $1 AND "vacanteId" = $2 LIMIT 1';
        const statusRes = await pool.query(statusQuery, [usuarioId, vacanteId]);
        
        const chatActivo = statusRes.rows.length > 0 ? statusRes.rows[0].chatActivo : true;

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

        res.json({
            chatActivo: chatActivo,
            mensajes: result.rows
        });
    } catch (error) {
        console.error('Error al obtener historial por vacante:', error);
        res.status(500).json({ error: 'Error al cargar el historial.' });
    }
});

// 2. ENVIAR MENSAJE (CORREGIDO: Con validación de chatActivo)
router.post('/enviar', async (req, res) => {
    const { senderId, receiverId, contenido, senderType, vacanteId } = req.body;
    try {
        const idPostulante = senderType === 'USUARIO' ? senderId : receiverId;
        
        const checkQuery = 'SELECT "chatActivo" FROM "Postulacion" WHERE "usuarioId" = $1 AND "vacanteId" = $2';
        const checkRes = await pool.query(checkQuery, [idPostulante, vacanteId]);

        if (checkRes.rows.length > 0 && checkRes.rows[0].chatActivo === false) {
            return res.status(403).json({ error: 'El chat ha sido desactivado para esta postulación.' });
        }

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

// 5.5 OBTENER MIS CONVERSACIONES
router.get('/mis-conversaciones/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const query = `
            SELECT DISTINCT ON (m."senderEmpresaId", m."vacanteId")
                e.id AS "empresaId",
                e.nombre AS "nombreEmpresa",
                m."vacanteId",
                v.titulo AS "tituloVacante",
                m.contenido AS "ultimoMensaje",
                m."fechaEnvio"
            FROM "Mensaje" m
            JOIN "Empresa" e ON (m."senderEmpresaId" = e.id OR m."receiverId" = e.id)
            JOIN "Vacante" v ON m."vacanteId" = v.id
            WHERE m."senderUsuarioId" = $1 OR m."receiverId" = $1
            ORDER BY m."senderEmpresaId", m."vacanteId", m."fechaEnvio" DESC
        `;
        
        const result = await pool.query(query, [usuarioId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener conversaciones:', error);
        res.status(500).json({ error: 'Error al cargar conversaciones.' });
    }
});

// 6. ACTIVAR/DESACTIVAR CHAT (Solo Empresa)
router.patch('/status-chat', async (req, res) => {
    const { usuarioId, vacanteId, activo } = req.body;
    try {
        const query = 'UPDATE "Postulacion" SET "chatActivo" = $1 WHERE "usuarioId" = $2 AND "vacanteId" = $3';
        await pool.query(query, [activo, usuarioId, vacanteId]);
        res.json({ success: true, chatActivo: activo });
    } catch (error) {
        console.error('Error al cambiar estado del chat:', error);
        res.status(500).json({ error: 'No se pudo actualizar el estado del chat.' });
    }
});

export default router;