import { CorsOptions } from 'cors'
/**
 * Configuración de CORS para permitir solicitudes solo desde el frontend 
 * o herramientas de testing (origin undefined).
 */
export const corsConfig: CorsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.includes('localhost') ||
      origin.includes('ngrok-free.dev')
    ) {
      return callback(null, true);
    }

    return callback(new Error('Error de CORS'));
  },
  credentials: true
}

//Este es un cambio de prueba para ver si se sube a git correctamente.