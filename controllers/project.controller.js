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
const createProject = async (req, res) => {
  let { name, color, is_favorite = 0 } = req.body;

  // Validate required fields
  if (!name || !color) {
    return sendResponse(res, 400, "Name and color are required!");
  }

  if (is_favorite !== undefined) {
    is_favorite = is_favorite == true ? 1 : 0;
  }

  try {
    // Store project
    let data = await create({ name, color, is_favorite, user_id: req.user.id });
    return sendResponse(res, 201, {
      message: "Project created successfully!",
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

// Update project
const updateProject = async (req, res) => {
  let projectId = Number(req.params.id);

  // Validate for project data
  if (!req.body || Object.entries(req.body).length === 0) {
    return sendResponse(res, 400, "Project data cannot be empty");
  }

  try {
    await update(projectId, req.body);
    return sendResponse(res, 200, "Project updated successfully!");
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || `Error updating Project with id ${projectId}`
    );
  }
};

// Get specific project by id
const findProject = async (req, res) => {
  const projectId = Number(req.params.id);

  // Validate project ID
  if (!projectId || isNaN(projectId)) {
    return sendResponse(res, 400, { message: "Invalid project id" });
  }

  try {
    let data = await findById(projectId);
    console.log(data);

    return sendResponse(res, 200, data);
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || `Error retrieving project with id ${projectId}`
    );
  }
};

// GET ALL PROJECTS
const findAllProjects = async (req, res) => {
  try {
    let data = await findAll(req);
    return sendResponse(res, 200, data);
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || "Error occurred while retrieving projects"
    );
  }
};

// REMOVE PROJECT
const removeProject = async (req, res) => {
  const projectId = Number(req.params.id);

  // Validate project ID
  if (!projectId || isNaN(projectId)) {
    return sendResponse(res, 400, "Invalid project id");
  }

  try {
    await remove(projectId);
    return sendResponse(res, 200, "Project delete successfully");
  } catch (error) {
    return sendResponse(
      res,
      500,
      error.message || `Could not delete project with id ${projectId}`
    );
  }
};

// REMOVE ALL PROJECTS
const removeAllProject = async (_, res) => {
  try {
    await removeAll();
    return sendResponse(res, 200, "All projects deleted successfully!");
  } catch (error) {
    return sendResponse(res, 500, "Error while deleting projects");
  }
};

export {
  createProject,
  updateProject,
  findProject,
  findAllProjects,
  removeProject,
  removeAllProject,
};
