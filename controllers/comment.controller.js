import { create, find, remove, update } from "../models/comment.model.js";
import { sendResponse } from "../utils/helper.js";

// Create new comment
const createComment = (req, res) => {
  const { project_id = null, task_id = null, content } = req.body;

  // Validate project ID and task ID
  if (!project_id && !task_id) {
    return sendResponse(res, 400, "ProjectId or taskId required!");
  }

  // Validate required field
  if (!content || content.length == 0) {
    return sendResponse(res, 400, "Comment content is required!");
  }

  create({ project_id, task_id, content }, (err, data) => {
    if (err) {
      return sendResponse(
        res,
        500,
        err.message || "Some error occurred while creating the Project."
      );
    }

    return sendResponse(res, 200, {
      message: "Comment created successfully",
      data,
    });
  });
};

// Update comment by ID
const updateComment = (req, res) => {
  const commentId = Number(req.params.id);

  // Validate comment ID
  if (!commentId) {
    return sendResponse(res, 400, "Comment id required!");
  }

  // Validate for comment data
  if (!req.body || Object.entries(req.body).length === 0) {
    return sendResponse(res, 400, "Comment data cannot be empty");
  }

  update(commentId, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return sendResponse(
          res,
          404,
          `Not found comment with id ${commentId}!`
        );
      }

      return sendResponse(
        res,
        500,
        err.message || `Error updating comment with id ${commentId}!`
      );
    }

    return sendResponse(res, 200, "Comment update successfully");
  });
};

// Get comment by ID
const findComment = (req, res) => {
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

  find(req, (err, data) => {
    if (err) {
      return sendResponse(res, 500, err.message || "Error in finding comments");
    }

    return sendResponse(res, 200, data);
  });
};

// Delete comment by ID
const deleteComment = (req, res) => {
  const commentId = Number(req.params.id);

  if (isNaN(commentId)) {
    return sendResponse(res, 400, "Invalid CommentId format!");
  }

  remove(commentId, (err) => {
    if (err) {
      if (err.kind === "not_found") {
        return sendResponse(res, 404, `Not found comment with id ${commentId}`);
      }

      return sendResponse(
        res,
        500,
        err.message || `Error deleting comment with id ${commentId}`
      );
    }

    return sendResponse(res, 200, "Comment deleted successfully");
  });
};

export { createComment, updateComment, findComment, deleteComment };
