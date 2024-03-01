import express from "express";
import {authLogin, authRegister} from "../controllers/auth/auth.controller";

const router = express.Router();

// POST /auth/register
router.post('/register', authRegister)

// POST /auth/login
router.post('/login', authLogin)

export const authRoutes = router;