import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

/** Middleware de autenticación, verifica el token JWT y agrega el usuario a la solicitud
 * Si el token es válido, se decodifica y se busca el usuario en la base de datos. 
 * Si se encuentra, se agrega a la solicitud (req.user) y se llama a next() 
 * para continuar con la siguiente función middleware o ruta. 
 * Si el token no es válido o no se encuentra el usuario, se devuelve un error 401 o 500 respectivamente.
 */
declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction  ) => {
    const bearer = req.headers.authorization
    if (!bearer) {
        const error = new Error('No autorizado')
        res.status(401).json({ error: error.message })
        return
    }

    const [, token] = bearer.split(' ')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email')
            if (user) {
                req.user = user
                next()
            }else {
                res.status(500).json({ error: 'Token no valido' })
            }           

        }
    } catch (error) {
        res.status(500).json({ error: 'Token no valido' })
    }

    

}