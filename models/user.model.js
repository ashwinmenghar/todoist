import db from "../config/db.js";
import { users } from "../schema/schema.js";

// Insert a new user
const create = async (newUser, result) => {
  try {
    const res = await db.insert(users).values(newUser);
    result(null, { id: res.lastInsertRowid, newUser });
  } catch (error) {
    console.log("error", error.message);
    result(error);
  }
};

const find = async () => {
  try {
    // Fetch users
    const allUsers = await db.select().from(users);
    console.log(allUsers);
    return allUsers;
  } catch (error) {
    console.log(error.message);
  }
};

export { create, find };
