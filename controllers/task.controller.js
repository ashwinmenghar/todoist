import { create, remove, update } from "../models/task.model.js";

// Create a task
const createTask = (req, res) => {
  const {
    content,
    description,
    due_date,
    is_completed = 0,
    project_id,
  } = req.body;

  // Validate required fields
  if (!content || !project_id) {
    return res.status(400).json({
      message: "Content and project_id are required!",
    });
  }

  create(
    { content, description, due_date, is_completed, project_id },
    (err, data) => {
      if (err) {
        return res.status(500).json({
          message:
            err.message || "Some error occurred while creating the Task.",
        });
      }

      return res.status(201).json({
        message: "Task created successfully",
        data,
      });
    }
  );
};

// Update a task
const updateTask = (req, res) => {
  const taskId = Number(req.params.id);

  // Validate task ID
  if (!taskId || isNaN(taskId)) {
    return res.status(400).json({ message: "Invalid task ID!" });
  }

  const { content, description, due_date, is_completed, project_id } = req.body;

  // Validate required fields
  if (!content || !project_id) {
    return res.status(400).json({
      message: "Content and project_id are required!",
    });
  }

  update(
    taskId,
    { content, description, due_date, is_completed, project_id },
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).json({
            message: `Task with ID ${taskId} not found.`,
          });
        }

        return res.status(500).json({
          message: `Error updating task with ID ${taskId}.`,
          error: err.message || "Internal server error",
        });
      }

      return res.json({ message: "Task updated successfully", data });
    }
  );
};

// Remove a task
const removeTask = (req, res) => {
  const taskId = Number(req.params.id);

  // Validate task ID
  if (!taskId || isNaN(taskId)) {
    return res.status(400).json({ message: "Invalid task ID!" });
  }

  remove(taskId, (err) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Task with ID ${taskId} not found.`,
        });
      }

      return res.status(500).json({
        message: `Error deleting task with ID ${taskId}.`,
        error: err.message || "Internal server error",
      });
    }

    return res.json({ message: "Task deleted successfully!" });
  });
};

export { createTask, updateTask, removeTask };
