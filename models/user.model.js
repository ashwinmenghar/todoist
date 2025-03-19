import { eq } from "drizzle-orm";
import db from "../config/db.js";
import { users } from "../schema/schema.js";

// Insert a new user
const create = async (newUser) => {
  try {
    const res = await db.insert(users).values(newUser);
    return { id: res.lastInsertRowid, ...newUser };
  } catch (error) {
    throw new Error(error);
  }
};

// Find user by ID
const findByEmail = async (email) => {
  try {
    return await db.select().from(users).where(eq(users.email, email));
  } catch (error) {
    throw new Error(error);
  }
};

// Remove user by Id
const removeUser = async (userId) => {
  console.log(userId);

  try {
    const userResponse = await db
      .update(users)
      .set({
        deleted_at: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    console.log("User deleted successfully");

    return userResponse;
  } catch (error) {
    throw new Error(error);
  }
};

export { create, findByEmail, removeUser };
