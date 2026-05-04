import type { Request, Response } from "express";

import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

/** Controlador de autenticación, maneja la creación de cuentas, inicio de sesión, confirmación de cuenta y restablecimiento de contraseña */
export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;
      const userExists = await User.findOne({ email });

      if (userExists) {
        const error = new Error("El usuario ya existe");
        res.status(409).json({ error: error.message });
        return;
      }
      const user = new User(req.body);

      user.password = await hashPassword(password)

      // Generar el Token
      const token = new Token()
      token.token = generateToken();
      token.user = user.id;

      await Promise.all([user.save(), token.save()]);

      try {
        await AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          tocken: token.token
        })
      } catch (emailError) {
        console.error("Error al enviar el email de confirmación:", emailError)
      }

      res.send("Usuario creado, revisa tu correo para confirmar tu cuenta");
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  };
  static confirmAccount = async (req: Request, res: Response) => {
      try {
        const { token } = req.body;

        const tokenExists = await Token.findOne({ token })

        if (!tokenExists) {
            const error = new Error("Token no válido");
            res.status(404).json({ error: error.message });
            return;
        }
        const user = await User.findById(tokenExists.user)
        user.confirmed = true;
        await Promise.allSettled([user.save(), tokenExists.deleteOne()])
        res.send("Cuenta confirmada correctamente");
      }  
      catch (error) {
          res.status(500).json({ error: "Error al confirmar el usuario" });
    }
  }

   static login = async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
          const error = new Error("Usuario no encontrado");
          res.status(404).json({ error: error.message });
          return;
        }
        if(!user.confirmed) {
          const token = new Token()
          token.user = user.id
          token.token = generateToken()
          await token.save()
          
          try {
            await AuthEmail.sendConfirmationEmail({
              email: user.email,
              name: user.name,
              tocken: token.token
            })
          } catch (emailError) {
            console.error("Error al enviar el email de confirmación:", emailError)
          }

          const error = new Error("Cuenta no confirmada, hemos enviado un e-mail de confirmación");
          res.status(401).json({ error: error.message });
          return;
        }
        //revisar contraseña
        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
          const error = new Error("Contraseña incorrecta");
          res.status(401).json({ error: error.message });
          return;
        }
        const token = generateJWT({id: user.id})
        res.send(token);

      } catch (error) {
          res.status(500).json({ error: "Error al iniciar sesión" });
    }
  }
  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      //Usuario existe
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El usuario no esta registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      if(user.confirmed) {
        const error = new Error("La cuenta ya esta confirmada");
        res.status(409).json({ error: error.message });
        return;
      }

      // Generar el Token
      const token = new Token()      
      token.token = generateToken();
      token.user = user.id;

      await Promise.all([user.save(), token.save()]);

      try {
        await AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          tocken: token.token
        })
      } catch (emailError) {
        console.error("Error al enviar el email de confirmación:", emailError)
      }

      res.send("Se envió un nuevo token a tu e-mail");
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      //Usuario existe
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El usuario no esta registrado");
        res.status(404).json({ error: error.message });
        return;
      }

      // Generar el Token
      const token = new Token()      
      token.token = generateToken();
      token.user = user.id;
      await token.save()

      try {
        await AuthEmail.sendPasswordResetToken({
          email: user.email,
          name: user.name,
          tocken: token.token
        })
      } catch (emailError) {
        console.error("Error al enviar el email de restablecimiento:", emailError)
      }

      res.send("Revisa tu e-mail para instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  };
  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      //Usuario existe
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error("El token no es válido");
        res.status(404).json({ error: error.message });
        return;
      }

      res.send("Token válido, puedes cambiar tu contraseña");
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  };
  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      //Usuario existe
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("El token no es válido");
        res.status(404).json({ error: error.message });
        return;
      }

        const user = await User.findById(tokenExist.user)
        user.password = await hashPassword(password)

        await Promise.allSettled([user.save(), tokenExist.deleteOne()])

      res.send("Contraseña actualizada correctamente");
    } catch (error) {
      res.status(500).send({ error: "Error al crear el usuario" });
    }
  };
  
  static user = async (req: Request, res: Response) => {
    res.json(req.user)
    return
  };
  static updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body

    const userExists = await User.findOne({ email })

    if (userExists && userExists.id.toString() !== req.user.id.toString()) {
      const error = new Error("El e-mail ya esta en uso");
      res.status(409).json({ error: error.message });
      return;
    }

    req.user.name = name
    req.user.email = email

    try {
      await req.user.save()
      res.send("Perfil actualizado correctamente")
    } catch (error) {
      res.status(500).send({ error: "Error al actualizar el perfil" });
    }
  }

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body
    const user = await User.findById(req.user.id)

    const isPasswordCorrect = await checkPassword(current_password, user.password)
    if (!isPasswordCorrect) {
      const error = new Error("Contraseña actual incorrecta");
      res.status(401).json({ error: error.message });
      return;
    }

    try {
      user.password = await hashPassword(password)
      await user.save()

      res.send("Contraseña actualizada correctamente");
    } catch (error) {
      res.status(500).send({ error: "Error al actualizar la contraseña" });
    }
    
  }

  static checkPassword = async (req: Request, res: Response) => {
  const {password } = req.body
      const user = await User.findById(req.user.id)

      const isPasswordCorrect = await checkPassword(password, user.password)
      if (!isPasswordCorrect) {
        const error = new Error("Contraseña actual incorrecta");
        res.status(401).json({ error: error.message });
        return;
      }
      res.send("Contraseña correcta");
  }
}
