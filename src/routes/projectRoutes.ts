import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controller/ProjectController";
import { MilestoneController } from "../controller/MilestoneController";
import { TaskController } from "../controller/TaskController";
import { TeamMemberController } from "../controller/TeamController";
import { NoteController } from "../controller/NoteController";
import { handleInputErrors } from "../middleware/validation";
import { projectExists } from "../middleware/project";
import { milestoneExists } from "../middleware/milestone";
import { hasAuthorization, taskBelongsToMilestone, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";

const router = Router()
router.use(authenticate)

/** Project routes */
router.post('/',
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProjects)
router.get('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.param('projectId', projectExists)

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)
router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)

/** Team routes */
router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('Email no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)
router.get('/:projectId/team', TeamMemberController.getProjectTeam)
router.post('/:projectId/team',
    body('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)
router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** Milestone routes */
router.post('/:projectId/milestones',
    hasAuthorization,
    body('name').notEmpty().withMessage('El nombre del hito es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del hito es obligatoria'),
    handleInputErrors,
    MilestoneController.createMilestone
)
router.get('/:projectId/milestones', MilestoneController.getAllMilestones)

router.param('milestoneId', milestoneExists)

router.get('/:projectId/milestones/:milestoneId',
    param('milestoneId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    MilestoneController.getMilestoneById
)
router.put('/:projectId/milestones/:milestoneId',
    hasAuthorization,
    param('milestoneId').isMongoId().withMessage('ID no válido'),
    body('name').notEmpty().withMessage('El nombre del hito es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del hito es obligatoria'),
    handleInputErrors,
    MilestoneController.updateMilestone
)
router.delete('/:projectId/milestones/:milestoneId',
    hasAuthorization,
    param('milestoneId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    MilestoneController.deleteMilestone
)

/** Task routes */
router.post('/:projectId/milestones/:milestoneId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)
router.get('/:projectId/milestones/:milestoneId/tasks', TaskController.getMilestoneTasks)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToMilestone)

router.get('/:projectId/milestones/:milestoneId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.getTaskById
)
router.put('/:projectId/milestones/:milestoneId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)
router.delete('/:projectId/milestones/:milestoneId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.deleteTask
)
router.post('/:projectId/milestones/:milestoneId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)

/** Note routes */
router.post('/:projectId/milestones/:milestoneId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)
router.get('/:projectId/milestones/:milestoneId/tasks/:taskId/notes', NoteController.getTaskNotes)
router.delete('/:projectId/milestones/:milestoneId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router
