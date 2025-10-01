import express from "express";
import { protect } from "../middleware/authMiddleware.js"; 
import { 
  getTasks, 
  createTask, 
  toggleTask, 
  deleteTask 
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", toggleTask);
router.delete("/:id", deleteTask);

export default router;