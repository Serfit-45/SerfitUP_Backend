import { transporter } from "../config/nodemailer";
/** Clase para enviar correos electrónicos relacionados con la autenticación, como confirmación de cuenta y restablecimiento de contraseña */
interface IEmail {
    email: string,
    name: string,
    tocken: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        // enviar el correo de confirmación
      await transporter.sendMail({
        from: '"SerfitUp" <moncloud@nodoware.com>',
        to: user.email,
        subject: "Confirma tu cuenta",
        text: `Hola, por favor confirma tu cuenta haciendo clic en el siguiente enlace: `,
        html: ` <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px;"> 
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> 
        <h2 style="color: #444; text-align: center;">¡Bienvenido a SerfitUp, ${user.name}!</h2> <p style="font-size: 16px; line-height: 1.5; color: #555;"> 
        Has creado tu cuenta en <strong>SerfitUp</strong>, ¡ya casi está todo listo! Solo debes confirmar tu cuenta para poder comenzar a usarla. 
        </p> <p style="font-size: 16px; line-height: 1.5; color: #555;"> Para confirmar tu cuenta, visita el siguiente enlace: 
        </p> <div style="text-align: center; margin: 20px 0;"> 
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account?token=${user.tocken}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
        Confirmar Cuenta</a> </div> <p style="font-size: 16px; line-height: 1.5; color: #555;"> También puedes ingresar el siguiente código para confirmar tu cuenta: 
        </p> <div style="text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;"> ${user.tocken} 
        </div> <p style="font-size: 16px; line-height: 1.5; color: #555;"> <strong>Nota:</strong> Este token expira en 10 minutos. </p> 
        <p style="text-align: center; color: #999; font-size: 14px; margin-top: 20px;"> Si no has solicitado esta cuenta, puedes ignorar este mensaje. </p> </div> </div> `
      });
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        // enviar el correo de restablecimiento de contraseña
      await transporter.sendMail({
        from: '"SerfitUp" <moncloud@nodoware.com>',
        to: user.email,
        subject: "Restablece tu contraseña",
        text: `Hola, por favor restablece tu contraseña haciendo clic en el siguiente enlace: `,
        html: ` <div style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; padding: 20px; border-radius: 8px;"> 
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"> 
        <h2 style="color: #444; text-align: center;">¡Hola, ${user.name}!</h2> <p style="font-size: 16px; line-height: 1.5; color: #555;"> 
        Has solicitado restablecer tu contraseña en <strong>SerfitUp</strong>. 
        </p> <p style="font-size: 16px; line-height: 1.5; color: #555;"> Para restablecer tu contraseña, visita el siguiente enlace: 
        </p> <div style="text-align: center; margin: 20px 0;"> 
        <a href="${process.env.FRONTEND_URL}/auth/new-password?token=${user.tocken}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
        Restablecer Contraseña</a> </div> <p style="font-size: 16px; line-height: 1.5; color: #555;"> También puedes ingresar el siguiente código para restablecer tu contraseña: 
        </p> <div style="text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0;"> ${user.tocken} 
        </div> <p style="font-size: 16px; line-height: 1.5; color: #555;"> <strong>Nota:</strong> Este token expira en 10 minutos. </p> 
        <p style="text-align: center; color: #999; font-size: 14px; margin-top: 20px;"> Si no has solicitado esta cuenta, puedes ignorar este mensaje. </p> </div> </div> `
      });
    }
}