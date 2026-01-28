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


const router = Router();

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.get("/users", asyncHandler(readUsers));
router.get("/users/:id", asyncHandler(getUserById));
router.put("/users/:id", asyncHandler(updateUser));
router.delete("/users/:id", asyncHandler(deleteUser));

export default router;