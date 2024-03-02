import express from "express";
import multer from "multer";
import {authMiddleware} from "../middleware/auth.middleware";
import {projectFilesGet, projectFilesUpload} from "../controllers/projects/files/projects.files.controller";

const router = express.Router();

const fileHandler = multer();

// /projects is a protected route that requires authentication
router.use(authMiddleware);

// GET /projects
router.get('/')

// POST /projects
router.post('/')


// GET /projects/:projectId/files
router.get('/:projectId/files', projectFilesGet);

// POST /projects/:projectId/files
router.post('/:projectId/files', fileHandler.array('files'), projectFilesUpload)

export const projectsRoute = router;