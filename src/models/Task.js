import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reminder: { type: Date }, 
  alerted: { type: Boolean, default: false } // NEW: Status for audio alert
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;