import {Router} from "express";

import{
    loginUser,
    refreshAccessToken,
    logoutUser,
} from "../controllers/user.controller.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {validate} from "../middlewares/validation.middleware.js"
import {loginSchema} from "../validators/user.validator.js";

const router = Router();

router.post("/login", validate(loginSchema),asyncHandler(loginUser));
router.post("/refresh", asyncHandler(refreshAccessToken));

router.post("/logout", authMiddleware, asyncHandler(logoutUser));

export default router;

