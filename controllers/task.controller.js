import { create, remove, update, find } from "../models/task.model.js";
import { sendResponse } from "../utils/helper.js";

// Create a task
const createTask = async (req, res) => {
  let {
    content,
    description,
    due_date = null,
    is_completed = 0,
    project_id,
  } = req.body;

  // Ensure is_completed is either 0 or 1
  is_completed = is_completed === true ? 1 : 0;

  // Validate required fields
  if (!content || !project_id) {
    return sendResponse(res, 400, "Content and project_id are required!");
  }

  if (isNaN(project_id)) {
    return sendResponse(res, 400, "Invalid project_id format!");
  }

  try {
    const data = await create({
      content,
      description,
      due_date,
      is_completed,
      project_id,
    });

    return sendResponse(res, 201, {
      message: "Task created successfully",
      data,
    });
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || "Some error occurred while creating the Task."
    );
  }
};

// Update a task
const updateTask = async (req, res) => {
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

  try {
    const data = await update(taskId, req.body);
    return sendResponse(res, 200, {
      message: "Task updated successfully",
      data,
    });
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || `Error updating task with ID ${taskId}.`
    );
  }
};

// Remove a task
const removeTask = async (req, res) => {
  const taskId = Number(req.params.id);

  // Validate task ID
  if (!taskId || isNaN(taskId)) {
    return sendResponse(res, 400, "Invalid task ID!");
  }

  try {
    await remove(taskId);
    return sendResponse(res, 200, "Task deleted successfully!");
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || `Error deleting task with ID ${taskId}.`
    );
  }
};

// Find tasks
const findTask = async (req, res) => {
  try {
    const data = await find(req);
    return sendResponse(res, 200, data);
  } catch (error) {
    return sendResponse(res, 500, "Error finding task");
  }
};

export { createTask, updateTask, removeTask, findTask };
