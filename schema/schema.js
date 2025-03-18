import { sql } from "drizzle-orm";
import { date, timestamp } from "drizzle-orm/mysql-core";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color").notNull(),
  is_favorite: integer("is_favorite").default(0),
  user_id: integer("user_id").references(() => users.id),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  description: text("description"),
  due_date: date("due_date").default(null),
  is_completed: integer("is_completed").default(0),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  project_id: integer("project_id")
    .notNull()
    .references(() => projects.id),
});

export const comments = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content"),
  posted_at: date("posted_at").default(sql`CURRENT_TIMESTAMP`),
  project_id: integer("project_id").references(() => projects.id),
  task_id: integer("task_id").references(() => tasks.id),
});
