import { Request, Response } from "express"
import Project from "../models/Project"
import { Types } from "mongoose"

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        project.manager = new Types.ObjectId(req.user.id)
        try {
            await project.save()
            res.send('Proyecto creado correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error del servidor' })
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: req.user._id },
                    { team: req.user._id }
                ]
            })
            res.json(projects)
        } catch (error) {
            res.status(500).json({ error: 'Error del servidor' })
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.params.id).populate('milestones')
            if (!project) {
                res.status(404).json({ error: 'Proyecto no encontrado' })
                return
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                res.status(403).json({ error: 'No tienes permiso para ver este proyecto' })
                return
            }
            res.json(project)
        } catch (error) {
            res.status(500).json({ error: 'Error del servidor' })
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description
            await req.project.save()
            res.send('Proyecto actualizado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error del servidor' })
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()
            res.send('Proyecto eliminado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error del servidor' })
        }
    }
}
