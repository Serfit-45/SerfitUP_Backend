import { Request, Response } from "express"
import Project from "../models/Project"
import { Types } from "mongoose"
import Milestone from "../models/Milestone"
import Task from "../models/Task"

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
            const projects = await Project.aggregate([
                {
                    $match: {
                        $or: [{ manager: req.user._id }, { team: req.user._id }]
                    }
                },
                {
                    $lookup: {
                        from: 'milestones',
                        localField: '_id',
                        foreignField: 'project',
                        as: 'milestoneList'
                    }
                },
                {
                    $lookup: {
                        from: 'tasks',
                        let: { milestoneIds: '$milestoneList._id' },
                        pipeline: [
                            { $match: { $expr: { $in: ['$milestone', '$$milestoneIds'] } } },
                            {
                                $group: {
                                    _id: '$milestone',
                                    total: { $sum: 1 },
                                    completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
                                }
                            }
                        ],
                        as: 'milestoneTaskGroups'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'team',
                        foreignField: '_id',
                        as: 'teamDetails'
                    }
                },
                {
                    $addFields: {
                        milestoneProgress: {
                            $map: {
                                input: '$milestoneList',
                                as: 'ms',
                                in: {
                                    name: '$$ms.name',
                                    taskGroup: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: '$milestoneTaskGroups',
                                                    as: 'tg',
                                                    cond: { $eq: ['$$tg._id', '$$ms._id'] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                }
                            }
                        },
                        teamDetails: {
                            $map: {
                                input: '$teamDetails',
                                as: 'm',
                                in: { _id: '$$m._id', name: '$$m.name' }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        milestoneProgress: {
                            $map: {
                                input: '$milestoneProgress',
                                as: 'mp',
                                in: {
                                    name: '$$mp.name',
                                    total: { $ifNull: ['$$mp.taskGroup.total', 0] },
                                    completed: { $ifNull: ['$$mp.taskGroup.completed', 0] },
                                    percent: {
                                        $cond: [
                                            { $eq: [{ $ifNull: ['$$mp.taskGroup.total', 0] }, 0] },
                                            0,
                                            {
                                                $round: [
                                                    { $multiply: [{ $divide: ['$$mp.taskGroup.completed', '$$mp.taskGroup.total'] }, 100] },
                                                    0
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        projectName: 1,
                        clientName: 1,
                        description: 1,
                        manager: 1,
                        createdAt: 1,
                        teamDetails: 1,
                        milestoneProgress: 1
                    }
                }
            ])
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
