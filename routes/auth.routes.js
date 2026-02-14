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

import {
    loginLimiter,
    refreshLimiter,
    apiLimiter
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.use(apiLimiter);
router.post("/login", validate(loginSchema), loginLimiter, asyncHandler(loginUser));
router.post("/refresh", refreshLimiter, asyncHandler(refreshAccessToken));
router.post("/logout", authMiddleware, asyncHandler(logoutUser));

export default router;

