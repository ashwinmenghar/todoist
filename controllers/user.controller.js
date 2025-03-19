import { emailValidation, sendResponse } from "../utils/helper.js";
import { create, findByEmail, removeUser } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();
import jwt from "jsonwebtoken";

// Create new user
const register = async (req, res) => {
  // Validate required fields
  if (!req.body || Object.entries(req.body).length === 0) {
    return sendResponse(res, 400, "User data cannot be empty");
  }

  const { name, email } = req.body;

  if (!emailValidation(email)) {
    return sendResponse(res, 400, `Invalid email ${email}`);
  }

  const existingUser = await findByEmail(email);
  if (existingUser.length > 0) {
    return sendResponse(res, 400, `User with email ${email} already exists!`);
  }

  if (!name) {
    return sendResponse(res, 400, "User name is required");
  }

  try {
    const data = await create({ name, email });
    return sendResponse(res, 201, {
      message: "User registered successfully",
      data,
    });
  } catch (error) {
    return sendResponse(res, 500, error.message || "Something went wrong!");
  }
};

// Login user
const login = async (req, res) => {
  try {
    if (!req.body || Object.entries(req.body).length === 0) {
      return sendResponse(res, 400, "User credentials required");
    }

    const { email } = req.body;

    if (!emailValidation(email)) {
      return sendResponse(res, 400, "Invalid email");
    }

    const user = await findByEmail(email);

    if (!user) {
      return sendResponse(res, 404, `User with email ${email} does not exist`);
    }

    const token = jwt.sign({ ...user[0] }, process.env.JWT_SECRET);
    return sendResponse(res, 200, { message: "Login successfully", token });
  } catch (error) {
    return sendResponse(res, 500, error.messages || "Something went wrong!");
  }
};

// Update user
// const updateUser = (req, res) => {
//   // Validate required fields
//   if (!req.body || Object.entries(req.body).length === 0) {
//     return sendResponse(res, 400, "User data cannot be empty");
//   }

//   const { name, email } = req.body;
//   const userId = req.params.id;

//   if (!name) {
//     return sendResponse(res, 400, "User's name is required");
//   }

//   if (!emailValidation(email)) {
//     return sendResponse(res, 400, `Invalid email ${email}`);
//   }

//   // Check if the email exists for another user
//   findByField("email", email, (exists, existingUser) => {
//     if (exists && existingUser.id !== userId) {
//       return sendResponse(res, 400, `User with email ${email} already exists!`);
//     }
//   });

//   // Update user
//   update(userId, req.body, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         return sendResponse(res, 404, `Not found user with id ${userId}`);
//       }
//       return sendResponse(res, 500, `Error updating user with id ${userId}`);
//     }

//     return sendResponse(res, 200, {
//       message: "User updated successfully",
//       data,
//     });
//   });
// };

// // Delete User
const deleteUser = async (req, res) => {
  const userId = Number(req.user.id);

  // Validate required fields
  if (!userId || isNaN(userId)) {
    return sendResponse(res, 400, "Invalid user id");
  }

  try {
    await removeUser(userId);
    return sendResponse(res, 200, "User deleted successfully");
  } catch (error) {
    return sendResponse(
      res,
      404,
      error.message || `Error updating user with id ${userId}`
    );
  }
};

export {
  register,
  login,
  deleteUser,
  //  updateUser,
};
