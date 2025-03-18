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

// Create Indexes
const createIndexes = async () => {
  try {
    await Promise.all([
      runQuery(
        "CREATE INDEX IF NOT EXISTS idx_task_project ON tasks (project_id);",
        DB
      ),
      runQuery(
        "CREATE INDEX IF NOT EXISTS idx_task_due_date ON tasks (due_date);",
        DB
      ),
      runQuery(
        "CREATE INDEX IF NOT EXISTS idx_task_completed ON tasks (is_completed);",
        DB
      ),
      runQuery(
        "CREATE INDEX IF NOT EXISTS idx_comment_task ON comments (task_id);",
        DB
      ),
      runQuery(
        "CREATE INDEX IF NOT EXISTS idx_comment_project ON comments (project_id);",
        DB
      ),
    ]);
    console.log("✅ Indexes created.");
  } catch (error) {
    console.error("❌ Error creating indexes:", error);
    process.exit(1);
  }
};

// Enable foreign key constraints & optimizations
DB.serialize(() => {
  DB.run("PRAGMA journal_mode = WAL;"); // Improves write performance
  DB.run("PRAGMA synchronous = NORMAL;"); // Reduces sync overhead
  DB.run("PRAGMA temp_store = MEMORY;"); // Speeds up temp tables
  DB.run("PRAGMA cache_size = 100000;"); // Increases cache for better performance
  DB.run("PRAGMA foreign_keys = ON;"); // Ensure FK constraints are enabled
});

try {
  await createTables();
  await createIndexes(); // 🔹 Call the function after table creation
} catch (error) {
  console.error(error.message);
}

export { DB };
