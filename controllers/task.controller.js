import { create, remove, update, find } from "../models/task.model.js";
import { sendResponse } from "../utils/helper.js";

// Create a task
const createTask = (req, res) => {
  const { content, project_id } = req.body;

  // Validate required fields
  if (!content || !project_id) {
    return sendResponse(res, 400, "Content and project_id are required!");
  }

  if (isNaN(project_id)) {
    return sendResponse(res, 400, "Invalid project_id format!");
  }

  create(req.body, (err, data) => {
    if (err) {
      return sendResponse(
        res,
        500,
        err.message || "Some error occurred while creating the Task."
      );
    }

    return sendResponse(res, 201, {
      message: "Task created successfully",
      data,
    });
  });
};

// Update a task
const updateTask = (req, res) => {
  const taskId = Number(req.params.id);

  // Validate task ID
  if (!taskId) {
    return sendResponse(res, 400, "Task id required!");
  }
  if (isNaN(taskId)) {
    return sendResponse(res, 400, "Invalid task ID!");
  }

  // Validate ID
  if (Object.keys(req.body).length === 0) {
    return sendResponse(res, 400, "No fields provided for update!");
  }

  update(taskId, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return sendResponse(res, 404, `Task with ID ${taskId} not found.`);
      }

      return sendResponse(
        res,
        500,
        err.message || `Error updating task with ID ${taskId}.`
      );
    }

    return sendResponse(res, 200, {
      message: "Task updated successfully",
      data,
    });
  });
};

// Remove a task
const removeTask = (req, res) => {
  const taskId = Number(req.params.id);

  // Validate task ID
  if (!taskId || isNaN(taskId)) {
    return sendResponse(res, 400, "Invalid task ID!");
  }

  remove(taskId, (err) => {
    if (err) {
      if (err.kind === "not_found") {
        return sendResponse(res, 404, `Task with ID ${taskId} not found.`);
      }

      return sendResponse(
        res,
        500,
        err.message || `Error deleting task with ID ${taskId}.`
      );
    }

    return sendResponse(res, 200, "Task deleted successfully!");
  });
};

// Find tasks
const findTask = (req, res) => {
  find(req, (err, data) => {
    if (err) {
      return sendResponse(res, 500, "Error finding task");
    }

    return sendResponse(res, 200, data);
  });
};

export { createTask, updateTask, removeTask, findTask };
