import { DB } from "../utils/connect.js";

// CREATE A TASK
const create = async (newTask, result) => {
  try {
    const sql = `INSERT INTO tasks (content, description, due_date, is_completed, project_id) VALUES (?, ?, ?, ?, ?)`;

    const {
      content,
      description,
      due_date = null,
      is_completed = false,
      project_id,
    } = newTask;

    DB.run(
      sql,
      [content, description, due_date, is_completed, Number(project_id)],
      function (err) {
        if (err) {
          console.error("Error creating task:", err);
          result(err, null);
          return;
        }

        console.log("Task created:", { id: this.lastID, ...newTask });
        result(null, { id: this.lastID, ...newTask });
      }
    );
  } catch (error) {
    console.error("Unexpected error in create:", error);
    result(error, null);
  }
};

// UPDATE TASK USING ID
const update = async (id, task, result) => {
  try {
    let fields = [];
    let values = [];

    for (const [key, value] of Object.entries(task)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    let sql = `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    DB.run(sql, values, function (err) {
      if (err) {
        console.error("Error updating task:", err);
        return result(err, null);
      }
      if (this.changes === 0) {
        return result({ kind: "not_found" }, null);
      }

      console.log("Task updated:", { id, ...task });
      result(null, { id, ...task });
    });
  } catch (error) {
    console.error("Unexpected error in update:", error);
    result(error, null);
  }
};

// DELETE TASK USING ID
const remove = async (id, result) => {
  try {
    const sql = `DELETE FROM tasks WHERE id = ?`;

    DB.run(sql, [id], function (err) {
      if (err) {
        console.error("Error deleting task:", err);
        result(err, null);
        return;
      }

      if (this.changes === 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("Deleted task with id:", id);
      result(null, { message: "Task deleted successfully!" });
    });
  } catch (error) {
    console.error("Unexpected error in remove:", error);
    result(error, null);
  }
};

// FIND TASK
const find = (req, result) => {
  const filterMap = {
    project_id: { clause: "project_id = ?", transform: Number },
    is_completed: {
      clause: "is_completed = ?",
      transform: (val) => (val == true ? 1 : 0),
    },
    due_date: { clause: "due_date LIKE ?", transform: (val) => `%${val}%` },
    created_at: { clause: "created_at LIKE ?", transform: (val) => `%${val}%` },
  };

  let page = req.query["page"] ? Number(req.query["page"]) : 1;
  let limit = 1000;

  const filters = [];
  const values = [];

  Object.entries(filterMap).forEach(([key, { clause, transform }]) => {
    if (req.query[key] !== undefined) {
      filters.push(clause);
      values.push(transform(req.query[key]));
    }
  });

  let sql = `SELECT * FROM tasks${
    filters.length ? " WHERE " + filters.join(" AND ") : ""
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;

  DB.all(sql, values, (err, rows) => {
    if (err) return result(err);
    result(null, rows);
  });
};

export { create, update, remove, find };
