const express = require("express");
const router = express.Router();
const database = require("../database");

router.post("/", (req, res) => {
  const { title, description, priority, status, createdBy, assignedTo } = req.body;

  if (!title || !createdBy) {
    return res.status(400).json({ message: "Title and createdBy are required" });
  }

  if (priority && !["Low", "Medium", "High"].includes(priority)) {
    return res.status(400).json({ message: "Invalid priority" });
  }

  if (status && !["To Do", "In Progress", "Done"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  if (!database.findUserById(parseInt(createdBy))) {
    return res.status(404).json({ message: "Creator not found" });
  }

  if (assignedTo && !database.findUserById(parseInt(assignedTo))) {
    return res.status(404).json({ message: "Assigned user not found" });
  }

  const task = database.createTask({
    title,
    description,
    priority,
    status,
    createdBy: parseInt(createdBy),
    assignedTo: assignedTo ? parseInt(assignedTo) : null,
  });

  res.status(201).json({ message: "Task created", task });
});

router.get("/", (req, res) => {
  let tasks = database.getAllTasks();

  if (req.query.priority) tasks = tasks.filter((t) => t.priority === req.query.priority);
  if (req.query.status) tasks = tasks.filter((t) => t.status === req.query.status);
  if (req.query.assignedTo) tasks = tasks.filter((t) => t.assignedTo === parseInt(req.query.assignedTo));
  if (req.query.createdBy) tasks = tasks.filter((t) => t.createdBy === parseInt(req.query.createdBy));

  res.json({ tasks, count: tasks.length });
});

router.get("/user/:userId", (req, res) => {
  const tasks = database.getTasksByUser(parseInt(req.params.userId));
  res.json({ tasks, count: tasks.length });
});

router.get("/:id", (req, res) => {
  const task = database.getTaskById(parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

router.put("/:id", (req, res) => {
  const task = database.getTaskById(parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: "Task not found" });

  const { title, description, priority, status, assignedTo } = req.body;
  const updates = {};

  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;

  if (priority !== undefined) {
    if (!["Low", "Medium", "High"].includes(priority)) return res.status(400).json({ message: "Invalid priority" });
    updates.priority = priority;
  }

  if (status !== undefined) {
    if (!["To Do", "In Progress", "Done"].includes(status)) return res.status(400).json({ message: "Invalid status" });
    updates.status = status;
  }

  if (assignedTo !== undefined) {
    if (assignedTo !== null && !database.findUserById(parseInt(assignedTo))) {
      return res.status(404).json({ message: "Assigned user not found" });
    }
    updates.assignedTo = assignedTo !== null ? parseInt(assignedTo) : null;
  }

  const updated = database.updateTask(parseInt(req.params.id), updates);
  res.json({ message: "Task updated", task: updated });
});

router.delete("/:id", (req, res) => {
  if (!database.deleteTask(parseInt(req.params.id))) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json({ message: "Task deleted" });
});

module.exports = router;
