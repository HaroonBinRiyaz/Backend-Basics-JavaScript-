// Mongoose is a library for Node.js that helps you work with MongoDB easily.
import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        const uri = process.env.MONGODB_URI;
        if(!uri) throw new Error("MONODB_URI is missing in .env");

        await mongoose.connect(uri); //connect to monodb using this address 
        console.log("MongoDB connected");
    }catch(err){
        console.error("MongoDB connection error:", err.message);
        process.exit(1); //stop the server if DB can't connect
    }
};

export {connectDB};