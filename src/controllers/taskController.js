import Task from "../models/Task.js"; 

// GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Fetch tasks error", error: err.message });
  }
};

// POST /api/tasks
export const createTask = async (req, res) => {
  const { text, reminder } = req.body; // Accept reminder
  try {
    const task = await Task.create({ 
      text, 
      reminder: reminder || null, // Save reminder if provided
      user: req.user._id 
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Create task error", error: err.message });
  }
};

// PATCH /api/tasks/:id (Toggle task completion/Update)
export const toggleTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    
    // If request body is empty, it's a simple toggle request from the frontend
    if (Object.keys(req.body).length === 0) {
      task.completed = !task.completed; 
    } else {
      // If there is a body, merge it (allows updating reminder/text/etc.)
      Object.assign(task, req.body);
    }
    
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Update task error", error: err.message });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete task error", error: err.message });
  }
};