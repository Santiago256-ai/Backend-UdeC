import nodemailer from 'nodemailer';

// Configuración del transportador SMTP
// (Asegúrate de agregar estas variables en tu archivo .env)
const transporter = nodemailer.createTransport({
    service: 'gmail', // Al usar 'gmail', Nodemailer configura internamente el host y los puertos correctos
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// 👇 Añadimos 'nombreEmpresa' como el quinto parámetro
export const enviarCorreoCambioEstado = async (correo, nombres, tituloVacante, nuevoEstado, nombreEmpresa) => {
    try {
        const mailOptions = {
            // Actualizamos el 'from' para que muestre el nombre del portal correctamente en la bandeja de entrada
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
                            <span style="background-color: #00482b; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; letter-spacing: 1px;">
                                ${nuevoEstado}
                            </span>
                        </div>

                        <p>Ingresa a Empres360 PRO para ver más detalles y continuar con tu proceso.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">Este es un correo automático, por favor no respondas a este mensaje.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✉️ Correo de estado enviado exitosamente a: ${correo}`);
        
    } catch (error) {
        // Solo logueamos el error para que no tumbe la petición principal del usuario
        console.error("❌ Error al enviar el correo transaccional:", error.message);
    }
};