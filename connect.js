import sqlite3 from "sqlite3";
import { createProject, createTask } from "./utils/queries.js";

const sq3 = sqlite3.verbose();
const DB = new sq3.Database(
  "./todoist.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }
    console.log("Connected to SQLite database.");
  }
);

const runQuery = (sql, params = []) => {
  DB.run(sql, params, (err) => {
    if (err) {
      console.error("Error creating table:", err);
      return;
    }
    console.log("Tutorials table created or already exists.");
  });
};

// Create Tables
const createTables = async () => {
  try {
    await Promise.all([runQuery(createProject), runQuery(createTask)]);
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
  console.error("❌ Error :", error);
}

export { DB };
