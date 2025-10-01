import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";  
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();
connectDB();

const app = express();

// --- START CORS CONFIGURATION FOR PRODUCTION ---
// Allowed origins list updated with live production URLs
const allowedOrigins = [
    'http://localhost:5173', 
    'https://task-manager-api-ly73.onrender.com', // Live Backend API
    'https://task-manager-frontend.onrender.com' // Your ACTUAL live Render frontend URL
]; 

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS block for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
}));
// --- END CORS CONFIGURATION ---

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
