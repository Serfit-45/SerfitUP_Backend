import { Request, Response } from "express"
import Project from "../models/Project"
import { Types } from "mongoose"

/** Controlador de proyectos, maneja la creación, obtención, actualización y eliminación de proyectos */
export class  ProjectController {

    static createProject = async ( req: Request, res: Response) => {
        const project = new Project(req.body)  
        
        // Asignar el manager al proyecto
        project.manager = new Types.ObjectId(req.user.id)

        try {
            await project.save()
            res.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
    }
    static getAllProject = async ( req: Request, res: Response) => {        
        try {
            const projects = await Project.find({
              $or: [
                { manager: req.user._id },
                { team: req.user._id }
              ]              
            })
            res.json(projects)
            
        } catch (error) {
            console.log('Error en controller: ',error)
        }
    }
    
    static getProjectById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params
        try {
          const project = await (await Project.findById(id)).populate('tasks')      
          if (!project) {
            const error = new Error('Proyecto no encontrado')
            res.status(404).json({ error: error.message })
            return
          }
          
          if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
            const error = new Error('No tienes permiso para ver este proyecto')
            res.status(403).json({ error: error.message })
            return
          }

          res.json(project)
          return 
        } catch (error) {
          console.error(error)
          console.log('Error en controller: ',error)
          res.status(500).json({ error: 'Error del servidor' })
        }
      }
      
      static updateProject = async (req: Request, res: Response): Promise<void> => {        
        try {

          req.project.clientName = req.body.clientName
          req.project.projectName = req.body.projectName
          req.project.description = req.body.description
          await req.project.save()
          res.send('Proyecto Actualizado')
        } catch (error) {
          console.error(error)
          res.status(500).json({ error: 'Error del servidor' })
        }
      }

      static deleteProject = async (req: Request, res: Response): Promise<void> => {
        try {
         await req.project.deleteOne()  
          res.send('Proyecto Eliminado')
        } catch (error) {
          console.error(error)
          res.status(500).json({ error: 'Error del servidor' })
        }
      }

}