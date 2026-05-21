import type { Request, Response, NextFunction } from "express";
import Milestone, { IMilestone } from "../models/Milestone";

declare global {
    namespace Express {
        interface Request {
            milestone?: IMilestone
        }
    }
}

export async function milestoneExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { milestoneId } = req.params
        const milestone = await Milestone.findById(milestoneId)
        if (!milestone) {
            const error = new Error('Hito no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        req.milestone = milestone
        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
        console.log(error)
    }
}
