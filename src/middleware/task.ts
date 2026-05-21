import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task?: ITask
        }
    }
}

export async function taskExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) {
            const error = new Error('Tarea no encontrada')
            res.status(404).json({ error: error.message })
            return
        }
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
        console.log(error)
    }
}

export async function taskBelongsToMilestone(req: Request, res: Response, next: NextFunction) {
    if (req.task?.milestone.toString() !== req.milestone?.id.toString()) {
        const error = new Error("Acción no válida")
        res.status(403).json({ error: error.message })
        return
    }
    next()
}

export async function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.user?.id.toString() !== req.project?.manager.toString()) {
        const error = new Error("Acción no válida")
        res.status(403).json({ error: error.message })
        return
    }
    next()
}
