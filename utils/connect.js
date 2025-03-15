import sqlite3 from "sqlite3";
import {
  createComment,
  createProject,
  createTask,
  createUser,
} from "./queries.js";

import fs from "fs/promises";
import { runQuery } from "./helper.js";

const sq3 = sqlite3.verbose();

// Remove existing database file
try {
  // await fs.rm("./todoist.db", { recursive: true });
} catch (error) {
  console.error("❌ Error removing database file:", error);
}

const DB = new sq3.Database(
  "./todoist.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("✅ Connected to SQLite database.");
  }
);

// Create Tables
const createTables = async () => {
  try {
    await Promise.all([
      runQuery(createProject, DB),
      runQuery(createTask, DB),
      runQuery(createUser, DB),
      runQuery(createComment, DB),
    ]);
    console.log("✅ Tables created.");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
    process.exit(1);
  }
};

// Enable foreign key constraints
DB.run("PRAGMA foreign_keys = ON;");

try {
  await createTables();
} catch (error) {
  console.error(error.message);
}

export { DB };
