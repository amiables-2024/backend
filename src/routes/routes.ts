import express from "express";
import {authRoutes} from "./auth.routes";
import {projectsRoute} from "./project.routes";
import {avatarRoutes} from "./avatars.routes";
import {usersRoutes} from "./users.routes";

const router = express.Router();

// REQ /auth/
router.use('/auth', authRoutes);

// REQ /avatars/
router.use('/avatars', avatarRoutes);

// REQ /projects/
router.use('/projects', projectsRoute);

// REQ /users/
router.use('/users', usersRoutes);

// GET /
router.get('/', (req, res) => {
    res.json({running: true})
})

export const routesRouter = router;