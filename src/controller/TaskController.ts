import type { Request, Response } from "express";
import Task from "../models/Task";

/** Controlador de tareas, maneja la creación, obtención, actualización y eliminación de tareas
 * relacionadas con un hito. Cada función maneja una operación específica:
 * - createTask: Crea una nueva tarea y la asocia al hito actual.
 * - getMilestoneTasks: Obtiene todas las tareas asociadas al hito actual.
 * - getTaskById: Obtiene una tarea específica por su ID, incluyendo detalles de asignación, estado y notas.
 * - updateTask: Actualiza el nombre, descripción y asignación de una tarea específica.
 * - deleteTask: Elimina una tarea específica y la desasocia del hito actual.
 * - updateStatus: Actualiza el estado de una tarea específica y registra quién realizó el cambio.
 * Cada función maneja errores y devuelve respuestas adecuadas según el resultado de la operación.
 */

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.milestone = req.milestone.id
            task.assignedTo = req.body.assignedTo ?? null
            req.milestone.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.milestone.save()])
            res.send("Tarea creada correctamente")
        } catch (error: any) {
            console.error("Error al crear la tarea:", error.message)
            res.status(500).json({ error: "Error interno del servidor" })
        }
    }

    static getMilestoneTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ milestone: req.milestone.id })
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: "Hubo un error" })
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task.id)
                .populate({ path: 'assignedTo', select: 'id name email' })
                .populate({ path: 'completedBy.user', select: 'id name email' })
                .populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } })
            res.json(task)
        } catch (error) {
            res.status(500).json({ error: "Hubo un error" })
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description
            req.task.assignedTo = req.body.assignedTo ?? null
            await req.task.save()
            res.send("Tarea actualizada correctamente")
        } catch (error) {
            res.status(500).json({ error: "Hubo un error" })
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.milestone.tasks = req.milestone.tasks.filter(
                (task) => task.toString() !== req.task.id.toString()
            )
            await Promise.allSettled([req.task.deleteOne(), req.milestone.save()])
            res.send("Tarea eliminada correctamente")
        } catch (error) {
            res.status(500).json({ error: "Hubo un error" })
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.task.status = status
            req.task.completedBy.push({ user: req.user.id, status })
            await req.task.save()
            res.send('Tarea actualizada')
        } catch (error) {
            res.status(500).json({ error: "Hubo un error" })
        }
    }
}
