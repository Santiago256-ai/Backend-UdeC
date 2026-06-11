import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// 🟢 Función actualizada con bordes oscuros iguales al color del texto
const obtenerEstilosEstado = (estado) => {
    const estilos = {
        'PENDIENTE': 'background-color: #f1f5f9; color: #475569; border: 1px solid #475569;',
        'REVISION':  'background-color: #e0f2fe; color: #0369a1; border: 1px solid #0369a1;',
        'ENTREVISTA':'background-color: #f3e8ff; color: #7e22ce; border: 1px solid #7e22ce;', // Morado
        'PRUEBA':    'background-color: #fef9c3; color: #a16207; border: 1px solid #a16207;', // Mostaza/Naranja
        'FINALISTA': 'background-color: #dcfce7; color: #15803d; border: 1px solid #15803d;', // Verde
        'CONTRATADO':'background-color: #006b3f; color: white;   border: 1px solid #005a35;', // Verde oscuro UdeC
        'RECHAZADO': 'background-color: #fee2e2; color: #b91c1c; border: 1px solid #b91c1c;'  // Rojo
    };
    
    // Si por alguna razón el estado no coincide, usamos el verde institucional por defecto
    return estilos[estado.toUpperCase()] || 'background-color: #00482b; color: white; border: 1px solid #00482b;';
};


export const enviarCorreoCambioEstado = async (correo, nombres, tituloVacante, nuevoEstado, nombreEmpresa, postulacionId) => {
    try {
        const urlVacante = `${process.env.FRONTEND_URL}/vacantes-dashboard?resaltar=${postulacionId}`;
        
        // Obtenemos los colores dinámicos para este estado específico
        const estilosDinamicos = obtenerEstilosEstado(nuevoEstado);

        const mailOptions = {
            from: '"Empres360 PRO" <notificaciones.empres360pro@gmail.com>', 
            to: correo,
            subject: `Actualización de tu postulación: ${tituloVacante}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-top: 5px solid #00482b; border-radius: 8px; overflow: hidden;">
                    
                    <div style="padding: 20px; text-align: center; background-color: #f9f9f9;">
                        <table width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td align="center" valign="middle">
                                    <img src="https://frontend-ude-c.vercel.app/UdeC2.png" alt="Logo Universidad" style="max-height: 55px; display: inline-block; vertical-align: middle;" />
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <span style="display: inline-block; width: 2px; height: 45px; background-color: #00482b; vertical-align: middle; opacity: 0.3;"></span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <img src="https://frontend-ude-c.vercel.app/Logo.png" alt="Logo Empres360 PRO" style="max-height: 55px; display: inline-block; vertical-align: middle;" />
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div style="padding: 20px;">
                        <h2 style="color: #00482b;">¡Hola, ${nombres}!</h2>
                        
                        <p>Te escribimos para informarte que el estado de tu postulación a la vacante <strong>"${tituloVacante}"</strong> ha sido actualizado por la empresa <strong>${nombreEmpresa}</strong>.</p>
                        
                        <div style="margin: 30px 0; text-align: center;">
                            <span style="font-size: 14px; color: #666; display: block; margin-bottom: 5px;">Nuevo estado:</span>
                            
                            <span style="${estilosDinamicos} padding: 8px 16px; border-radius: 20px; font-weight: bold; letter-spacing: 1px; display: inline-block;">
                                ${nuevoEstado}
                            </span>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${urlVacante}" style="background-color: #00482b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 14px;">
                                Ver detalles de la vacante
                            </a>
                        </div>

                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">Este es un correo automático, por favor no respondas a este mensaje.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✉️ Correo de estado enviado exitosamente a: ${correo}`);
        
    } catch (error) {
        console.error("❌ Error al enviar el correo transaccional:", error.message);
    }
};