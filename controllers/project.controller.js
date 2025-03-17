import {
  create,
  findAll,
  findById,
  remove,
  removeAll,
  update,
} from "../models/project.model.js";
import { sendResponse } from "../utils/helper.js";

// Create a new project
const createProject = (req, res) => {
  let { name, color, is_favorite = false } = req.body;

  // Validate required fields
  if (!name || !color) {
    return sendResponse(res, 400, "Name and color are required!");
  }

  // Store project
  create({ name, color, is_favorite }, (err, data) => {
    if (err) {
      return sendResponse(
        res,
        500,
        err.message || "Some error occurred while creating the Project."
      );
    }

    return sendResponse(res, 200, {
      message: "Project created successfully!",
      data,
    });
  });
};

// Update project
const updateProject = (req, res) => {
  // let { name, color, is_favorite = false } = req.body;
  let projectId = Number(req.params.id);

  // Validate for project data
  if (!req.body || Object.entries(req.body).length === 0) {
    return sendResponse(res, 400, "Project data cannot be empty");
  }

  // Validate project ID
  // if (!projectId || isNaN(projectId)) {
  //   return sendResponse(res, 400, "Invalid project id");
  // }

  // // Validate required fields
  // if (!name || !color) {
  //   return sendResponse(res, 400, "Name and color are required!");
  // }

  // // Ensure `is_favorite` is either true or false
  // if (is_favorite !== undefined && ![false, true].includes(is_favorite)) {
  //   return sendResponse(res, 400, "is_favorite must be boolean!");
  // }

  update(projectId, req.body, function (err, data) {
    if (err) {
      if (err.kind === "not_found") {
        return sendResponse(
          res,
          404,
          `Not found Project with id ${projectId}.`
        );
      }

      return sendResponse(
        res,
        500,
        err.message || `Error updating Project with id ${projectId}`
      );
    }

    return sendResponse(res, 200, {
      message: "Project updated successfully!",
      data,
    });
  });
};

// Get specific project by id
const findProject = (req, res) => {
  const projectId = Number(req.params.id);

  // Validate project ID
  if (!projectId || isNaN(projectId)) {
    return sendResponse(res, 400, { message: "Invalid project id" });
  }

  findById(projectId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return sendResponse(res, 404, {
          message: `Not found Project with id ${projectId}.`,
        });
      }
      return sendResponse(res, 500, {
        message: `Error retrieving project with id ${projectId}`,
      });
    }

    return sendResponse(res, 200, data);
  });
};

// GET ALL PROJECTS
const findAllProjects = (req, res) => {
  findAll(req, (err, data) => {
    if (err) {
      return sendResponse(res, 500, "Error occurred while retrieving projects");
    }

    return sendResponse(res, 200, data);
  });
};

// REMOVE PROJECT
const removeProject = (req, res) => {
  const projectId = Number(req.params.id);

  // Validate project ID
  if (!projectId || isNaN(projectId)) {
    return sendResponse(res, 400, "Invalid project id");
  }

  remove(projectId, (err) => {
    if (err) {
      if (err.kind === "not_found") {
        return sendResponse(res, 404, `Not found project with id ${projectId}`);
      }
      return sendResponse(
        res,
        500,
        `Could not delete project with id ${projectId}`
      );
    }

    return sendResponse(res, 200, "Project delete successfully");
  });
};

// REMOVE ALL PROJECTS
const removeAllProject = (_, res) => {
  removeAll((err) => {
    if (err) {
      return sendResponse(res, 500, "Error while deleting projects");
    }

    return sendResponse(res, 200, "All projects deleted successfully!");
  });
};

export {
  createProject,
  updateProject,
  findProject,
  findAllProjects,
  removeProject,
  removeAllProject,
};
