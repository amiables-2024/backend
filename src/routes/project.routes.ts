import express from "express";
import multer from "multer";
import {authMiddleware} from "../middleware/auth.middleware";
import {projectFilesGet, projectFilesUpload} from "../controllers/projects/files/projects.files.controller";
import {
    projectTodosCreate,
    projectTodosEdit,
    projectTodosGet
} from "../controllers/projects/todos/projects.todos.controller";
import {projectGet, projectsCreate, projectsGet} from "../controllers/projects/projects.controller";
import {projectMessagesCreate, projectMessagesGet} from "../controllers/projects/messages/project.messages.controller";

const router = express.Router();

const fileHandler = multer();

// /projects is a protected route that requires authentication
router.use(authMiddleware);

// GET /projects
router.get('/', projectsGet)

// POST /projects
router.post('/', fileHandler.single('spec'), projectsCreate)

// GET /projects/:projectId
router.get('/:projectId', projectGet);

// GET /projects/:projectId/files
router.get('/:projectId/files', projectFilesGet);

// POST /projects/:projectId/files
router.post('/:projectId/files', fileHandler.array('files'), projectFilesUpload)

// POST /projects/:projectId/files/folder

// DELETE /projects/:projectId/files

// GET /projects/:projectId/todos
router.get('/:projectId/todos', projectTodosGet);

// POST /projects/:projectId/todos
router.post('/:projectId/todos', projectTodosCreate);

// PATCH /projects/:projectId/todos/:todoId
router.patch('/:projectId/todos/:todoId', projectTodosEdit);

// DELETE /projects/:projectId/todos

// GET /projects/:projectId/messages
router.get('/:projectId/messages', projectMessagesGet);

// POST /projects/:projectId/messages
router.post('/:projectId/messages', projectMessagesCreate);

export const projectsRoute = router;