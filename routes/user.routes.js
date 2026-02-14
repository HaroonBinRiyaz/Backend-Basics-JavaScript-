import { Router } from "express";
import{
    registerUser,
    readUsers,
    getUserById,
    updateUser,
    deleteUser,
    makeAdmin,
} from "../controllers/user.controller.js"

import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {validate} from "../middlewares/validation.middleware.js"
import { registerSchema, updateUserSchema } from "../validators/user.validator.js";

import {
    registerLimiter,
} from "../middlewares/rateLimit.middleware.js"

const router = Router();

//public routes
router.post("/register",  validate(registerSchema), registerLimiter, asyncHandler(registerUser));

//protected routes
router.get("/users", authMiddleware, asyncHandler(readUsers));
router.get("/users/:id",authMiddleware, asyncHandler(getUserById));
router.put("/users/:id", authMiddleware,validate(updateUserSchema),asyncHandler(updateUser));
router.patch("/users/:id", authMiddleware, validate(updateUserSchema), asyncHandler(updateUser));
router.patch("/users/:id/role", validate(updateUserSchema), authMiddleware, asyncHandler(makeAdmin));
router.delete("/users/:id", authMiddleware, asyncHandler(deleteUser));

export default router;