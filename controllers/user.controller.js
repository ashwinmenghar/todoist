import { create, update, remove, findByField } from "../models/user.model.js";
import { emailValidation, sendResponse } from "../utils/helper.js";

// Create new user
const createUser = (req, res) => {
  // Validate required fields
  if (!req.body || Object.entries(req.body).length === 0) {
    return sendResponse(res, 400, "User data cannot be empty");
  }

  const { name, email } = req.body;

  if (!emailValidation(email)) {
    return sendResponse(res, 400, `Invalid email ${email}`);
  }

  if (findByField("email", email)) {
    return sendResponse(res, 400, `User with email ${email} already exists!`);
  }

  if (!name) {
    return sendResponse(res, 400, "User name is required");
  }

  create([name, email], (err, data) => {
    if (err) {
      console.log(err);
      return sendResponse(res, 500, err.message);
    }

    return sendResponse(res, 200, data);
  });
};

// Update user
const updateUser = (req, res) => {
  // Validate required fields
  if (!req.body || Object.entries(req.body).length === 0) {
    return sendResponse(res, 400, "User data cannot be empty");
  }

  const { name, email } = req.body;
  const userId = req.params.id;

  if (!name) {
    return sendResponse(res, 400, "User's name is required");
  }

  if (!emailValidation(email)) {
    return sendResponse(res, 400, `Invalid email ${email}`);
  }

  // Check if the email exists for another user
  findByField("email", email, (exists, existingUser) => {
    if (exists && existingUser.id !== userId) {
      return sendResponse(res, 400, `User with email ${email} already exists!`);
    }
  });

  // Update user
  update(userId, req.body, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return sendResponse(res, 404, `Not found user with id ${userId}`);
      }
      return sendResponse(res, 500, `Error updating user with id ${userId}`);
    }

    return sendResponse(res, 200, {
      message: "User updated successfully",
      data,
    });
  });
};

// Delete User
const deleteUser = (req, res) => {
  const userId = Number(req.params.id);

  // Validate required fields
  if (!userId || isNaN(userId)) {
    return sendResponse(res, 400, "Invalid user id");
  }

  remove(userId, (err) => {
    if (err) {
      if (err.kind === "not_found") {
        return sendResponse(res, 404, `Not found user with id ${userId}`);
      }

      return sendResponse(res, 404, `Error updating user with id ${userId}`);
    }

    return sendResponse(res, 200, "User deleted successfully");
  });
};

export { createUser, updateUser, deleteUser };
