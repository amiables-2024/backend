import express from "express";
import {authRoutes} from "./auth.routes";
import {projectsRoute} from "./project.routes";

const router = express.Router();

// REQ /auth/
router.use('/auth', authRoutes);

// REQ /projects/
router.use('/projects', projectsRoute);


// GET /
router.get('/', (req, res) => {
    res.json({running: true})
})

export const routesRouter = router;