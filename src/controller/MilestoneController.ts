import { Request, Response } from "express"
import Milestone from "../models/Milestone"
import { Types } from "mongoose"

export class MilestoneController {

    static createMilestone = async (req: Request, res: Response) => {
        const milestone = new Milestone(req.body)
        milestone.project = new Types.ObjectId(req.project.id)
        try {
            req.project.milestones.push(milestone.id)
            await Promise.allSettled([milestone.save(), req.project.save()])
            res.send('Hito creado correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error del servidor' })
        }
    }

    static getAllMilestones = async (req: Request, res: Response) => {
        try {
            const milestones = await Milestone.find({ project: req.project.id })
            res.json(milestones)
        } catch (error) {
            res.status(500).json({ error: 'Error del servidor' })
        }
    }

    static getMilestoneById = async (req: Request, res: Response) => {
        try {
            const milestone = await Milestone.findById(req.milestone.id).populate('tasks')
            res.json(milestone)
        } catch (error) {
            res.status(500).json({ error: 'Error del servidor' })
        }
    }

    static updateMilestone = async (req: Request, res: Response) => {
        try {
            req.milestone.name = req.body.name
            req.milestone.description = req.body.description
            await req.milestone.save()
            res.send('Hito actualizado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error del servidor' })
        }
    }

    static deleteMilestone = async (req: Request, res: Response) => {
        try {
            req.project.milestones = req.project.milestones.filter(
                (m) => m.toString() !== req.milestone.id.toString()
            )
            await Promise.allSettled([req.milestone.deleteOne(), req.project.save()])
            res.send('Hito eliminado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error del servidor' })
        }
    }
}
