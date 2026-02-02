import { Router } from "express";
import{
    registerUser,
    readUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser
} from "../controllers/user.controller.js"

import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = Router();

//public routes
router.post("/register", asyncHandler(registerUser));


//protected routes
router.get("/users", authMiddleware, asyncHandler(readUsers));
router.get("/users/:id",authMiddleware, asyncHandler(getUserById));
router.put("/users/:id", authMiddleware,asyncHandler(updateUser));
router.patch("/users/:id", authMiddleware, asyncHandler(updateUser));
router.delete("/users/:id",authMiddleware, asyncHandler(deleteUser));

export default router;