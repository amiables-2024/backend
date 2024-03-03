import express from "express";
import {usersSearch} from "../controllers/users/users.controller";

const router = express.Router();

// GET /users/search
router.get('/search', usersSearch)

export const usersRoutes = router;