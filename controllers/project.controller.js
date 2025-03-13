import {
  create,
  findAll,
  findById,
  remove,
  removeAll,
  update,
} from "../models/project.model.js";

// Create a new project
const createProject = (req, res) => {
  let { name, color, is_favorite = false } = req.body;

  // Validate required fields
  if (!name || !color) {
    return res.status(400).json({ message: "Name and color are required!" });
  }

  // Store project
  create({ name, color, is_favorite }, (err, data) => {
    if (err) {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Project.",
      });
    }

    return res.send({ message: "Project created successfully!", data });
  });
};

// Update project
const updateProject = (req, res) => {
  let { name, color, is_favorite } = req.body;
  let projectId = Number(req.params.id);

  // Validate project ID
  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ message: "Invalid project id" });
  }

  // Validate required fields
  if (!name || !color) {
    return res.status(400).json({ message: "Name and color are required!" });
  }

  // Ensure `is_favorite` is either true or false
  if (is_favorite !== undefined && ![false, true].includes(is_favorite)) {
    return res.status(400).json({ message: "is_favorite must be boolean!" });
  }

  update(projectId, { name, color, is_favorite }, function (err, data) {
    if (err) {
      if (err.kind === "not_found") {
        return res
          .status(404)
          .send({ message: `Not found Project with id ${projectId}.` });
      }

      return res
        .status(500)
        .send({ message: `Error updating Project with id ${projectId}` });
    }

    return res.send({ message: "Project updated successfully!", data });
  });
};

// Get specific project by id
const findProject = (req, res) => {
  const projectId = Number(req.params.id);

  // Validate project ID
  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ message: "Invalid project id" });
  }

  findById(projectId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found Project with id ${projectId}.`,
        });
      }
      return res.status(500).send({
        message: `Error retrieving project with id ${projectId}`,
      });
    }

    res.send(data);
  });
};

// GET ALL PROJECTS
const findAllProjects = (_, res) => {
  findAll((err, data) => {
    if (err) {
      return res.status(500).send({
        message: "Error occurred while retrieving projects",
      });
    }

    return res.send(data);
  });
};

// REMOVE PROJECT
const removeProject = (req, res) => {
  const projectId = req.params.id;

  // Validate project ID
  if (!projectId || isNaN(projectId)) {
    return res.status(400).json({ message: "Invalid project id" });
  }

  remove(projectId, (err) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found project with id ${projectId}`,
        });
      }
      return res.status(500).send({
        message: `Could not delete project with id ${projectId}`,
      });
    }

    res.send({
      message: "Project delete successfully",
    });
  });
};

// REMOVE ALL PROJECTS
const removeAllProject = (_, res) => {
  removeAll((err, data) => {
    if (err) {
      return res.status(500).send({
        message: "Error while deleting projects",
      });
    }

    return res.send({ message: data.message });
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
