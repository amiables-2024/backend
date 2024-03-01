import express from "express";
import {authRoutes} from "./auth.routes";

const router = express.Router();

// REQ /auth/
router.use('/auth', authRoutes)

// GET /
router.get('/', (req, res) => {
    res.json({running: true})
})

export const routesRouter = router;