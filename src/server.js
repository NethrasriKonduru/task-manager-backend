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
// Allowed origins list updated with your specific live production URLs
const allowedOrigins = [
    'http://localhost:5173', 
    'https://task-manager-api-ly73.onrender.com', // Live Backend API
    'https://task-manager-frontend-1-veig.onrender.com' // <-- Your FINAL live Render frontend URL
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

// API Health Check / Default Route
app.get('/', (req, res) => {
    res.send('Task Manager API is running!');
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// --- START ERROR HANDLERS ---

// 404 Not Found Middleware (Must be defined after all routes)
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Generic Error Handler Middleware
app.use((err, req, res, next) => {
    // If status code is 200 (default), set it to 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // Only show stack trace in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// --- END ERROR HANDLERS ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
