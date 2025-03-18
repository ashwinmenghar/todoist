import { and, eq, like } from "drizzle-orm";
import db from "../../config/db.js";
import { tasks } from "../../schema/schema.js";

// CREATE A TASK
const create = async (newTask) => {
  console.log(newTask);

  try {
    const taskResponse = await db.insert(tasks).values(newTask);
    console.log("Task created successfully");
    return { id: taskResponse.lastInsertRowid, ...newTask };
  } catch (error) {
    throw new Error(error);
  }
};

// UPDATE TASK USING ID
const update = async (taskId, taskData) => {
  try {
    const taskResponse = await db
      .update(tasks)
      .set(taskData)
      .where(eq(taskId, tasks.id));

    if (taskResponse.changes === 0) {
      throw new Error(`Task with ID ${taskId} not found or no changes made`);
    }

    console.log("Task updated successfully");
    return { id: taskId, ...taskData };
  } catch (error) {
    throw new Error(error);
  }
};

// DELETE TASK USING ID
const remove = async (taskId) => {
  try {
    const taskResponse = await db.delete(tasks).where(eq(taskId, tasks.id));
    if (taskResponse.changes === 0) {
      throw new Error(`Task with ID ${taskId} not found or no changes made`);
    }

    console.log("Task removed successfully");
    return taskResponse;
  } catch (error) {
    throw new Error(error);
  }
};

// FIND TASK
const find = async (req) => {
  const filterMap = {
    project_id: {
      clause: (val) => eq(tasks.project_id, Number(val)),
    },
    is_completed: {
      clause: (val) => eq(tasks.is_completed, Number(val)),
    },
    due_date: {
      clause: (val) => like(tasks.due_date, `${val}%`),
    },
    created_at: {
      clause: (val) => like(tasks.created_at, `${val}%`),
    },
  };

  let page = Number(req.query["page"]) || 1;
  let limit = 10;

  const conditions = [];
  Object.entries(filterMap).forEach(([key, { clause }]) => {
    if (req.query[key] !== undefined) {
      conditions.push(clause(req.query[key]));
    }
  });

  try {
    return await db
      .select()
      .from(tasks)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset((page - 1) * limit);
  } catch (error) {
    throw new Error(error.message);
  }
};

export { create, update, remove, find };
