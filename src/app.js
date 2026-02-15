import express from "express";
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import dotenv from "dotenv";
import { errorHandler }  from "../middlewares/error.middleware.js";
import { connectDB } from "./db/connectDB.js";
import { requestLogger } from "../middlewares/requestLogger.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use(errorHandler);

await connectDB();

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})