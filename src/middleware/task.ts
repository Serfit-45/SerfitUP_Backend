import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

/** Middleware de tarea, verifica si la tarea existe, pertenece al proyecto y si el usuario tiene autorización para modificarla */
declare global {
    namespace Express {
        interface Request {
            task?: ITask
        }
    }
}
export async function taskExists(req: Request, res: Response, next: NextFunction ){
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        console.log("ID: ",task)
            if (!task) {
                    const error = new Error('Tarea no encontrada')
                    res.status(404).json({error: error.message}                    
                )                            }
            req.task = task
            next()       
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
        console.log(error)
    }
}  
export async function taskBelongsToProject(req: Request, res: Response, next: NextFunction ){
    if (req.task?.project.toString() !== req.project?.id.toString()) {
        const error = new Error("Acción no valida")
        res.status(403).json({ error: error.message })
      }
      next()
}

export async function hasAuthorization(req: Request, res: Response, next: NextFunction ){
    if ( req.user?.id.toString() !== req.project?.manager.toString() ) {
        const error = new Error("Acción no valida")
        res.status(403).json({ error: error.message })
      }
      next()
}