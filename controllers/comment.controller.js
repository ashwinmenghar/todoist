import { create, find, remove, update } from "../models/orm/comment.model.js";
import { sendResponse } from "../utils/helper.js";

// Create new comment
const createComment = async (req, res) => {
  const { project_id = null, task_id = null, content } = req.body;

  // Validate project ID and task ID
  if (!project_id && !task_id) {
    return sendResponse(res, 400, "ProjectId or taskId required!");
  }

  // Validate required field
  if (!content || content.length == 0) {
    return sendResponse(res, 400, "Comment content is required!");
  }

  try {
    let data = await create({ project_id, task_id, content });
    return sendResponse(res, 200, {
      message: "Comment created successfully",
      data,
    });
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || "Some error occurred while creating the Project."
    );
  }
};

// Update comment by ID
const updateComment = async (req, res) => {
  const commentId = Number(req.params.id);

  // Validate comment ID
  if (!commentId) {
    return sendResponse(res, 400, "Comment id required!");
  }

  // Validate for comment data
  if (!req.body || Object.entries(req.body).length === 0) {
    return sendResponse(res, 400, "Comment data cannot be empty");
  }

  try {
    await update(commentId, req.body);
    return sendResponse(res, 200, "Comment update successfully");
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || `Error updating comment with id ${commentId}!`
    );
  }
};

// Get comment by ID
const findComment = async (req, res) => {
  const taskId =
    req.query.task_id !== undefined ? Number(req.query.task_id) : null;
  const projectId =
    req.query.project_id !== undefined ? Number(req.query.project_id) : null;

  if (
    (taskId !== null && isNaN(taskId)) ||
    (projectId !== null && isNaN(projectId))
  ) {
    return res
      .status(400)
      .send({ message: "Invalid task or project ID format!" });
  }

  if (taskId === null && projectId === null) {
    return res
      .status(400)
      .send({ message: "Task ID or Project ID is required!" });
  }

  try {
    const data = await find(req.query);
    return sendResponse(res, 200, data);
  } catch (error) {
    return sendResponse(res, 500, error.message || "Error in finding comments");
  }
};

// Delete comment by ID
const deleteComment = async (req, res) => {
  const commentId = Number(req.params.id);

  if (isNaN(commentId)) {
    return sendResponse(res, 400, "Invalid CommentId format!");
  }

  try {
    await remove(commentId);
    return sendResponse(res, 200, "Comment deleted successfully");
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || `Error deleting comment with id ${commentId}`
    );
  }
};

export { createComment, updateComment, findComment, deleteComment };
