import express from "express";
import {authLogin, authRegister} from "../controllers/auth/auth.controller";
import {avatarUser} from "../controllers/avatars/avatars.controller";

const router = express.Router();

// GET /avatars/:userId
router.get('/:userId', avatarUser)

export const avatarRoutes = router;