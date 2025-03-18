import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

// Connect to SQLite database file
const sqlite = new Database("./todoist.db");
const db = drizzle(sqlite);

export default db;
