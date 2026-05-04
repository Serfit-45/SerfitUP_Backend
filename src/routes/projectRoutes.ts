import { Router } from "express";
import { body, param } from "express-validator"
import { ProjectController } from "../controller/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controller/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controller/TeamController";
import { NoteController } from "../controller/NoteController";

/** Rutas para proyectos, tareas, equipo y notas */
const router = Router()

router.use(authenticate) // Aplica autenticación a todas las rutas de este router

router.post('/', 
    body('projectName')
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
    .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
    .notEmpty().withMessage('La decripción del proyecto es obligatorio'),
    handleInputErrors,
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProject)

router.get('/:id', 
    param('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors, //recuperar errores 
    ProjectController.getProjectById
)

//Routes for task
router.param('projectId', projectExists)// para todas las rutas en comun 

router.put('/:projectId', 
    param('projectId').isMongoId().withMessage('Id no valido'),
    body('projectName')
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
    .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
    .notEmpty().withMessage('La decripción del proyecto es obligatorio'),
    handleInputErrors, //recuperar errores 
    hasAuthorization,
    ProjectController.updateProject
)

router.delete('/:projectId', 
    param('projectId').isMongoId().withMessage('Id no valido'),
    handleInputErrors, //recuperar errores 
    hasAuthorization,
    ProjectController.deleteProject
)

router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)
router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)
router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors, //recuperar errores 
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors, //recuperar errores 
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no valido'),
    handleInputErrors, //recuperar errores 
    TaskController.deleteTask
)
router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors, //recuperar errores 
    TaskController.updateStatus
)
/** Route for teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Email no valido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)
router.get('/:projectId/team', 
    TeamMemberController.getProjectTeam
)
router.post('/:projectId/team', 
    body('id')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)
router.delete('/:projectId/team/:userId', 
    param('userId')
        .isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes', 
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    NoteController.deleteNote
)


export default router