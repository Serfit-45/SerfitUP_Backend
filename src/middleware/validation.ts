import type { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

// ✅ Aquí forzamos el tipo de retorno a `void` para asegurarnos de que no se devuelva nada desde este middleware
export const handleInputErrors = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    response.status(400).json({ errors: errors.array() })
    return
  }
  next()
}

