import { DB } from "../connect.js";

// CREATE A TASK
const create = async (newTask, result) => {
  try {
    const sql = `INSERT INTO tasks (content, description, due_date, is_completed, project_id) VALUES (?, ?, ?, ?, ?)`;

    const {
      content,
      description,
      due_date = null,
      is_completed = 0,
      project_id,
    } = newTask;

    DB.run(
      sql,
      [content, description, due_date, is_completed, project_id],
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
    // Validate ID
    if (!id || isNaN(Number(id))) {
      return result({ message: "Invalid task ID!" }, null);
    }

    const { content, description, due_date, is_completed, project_id } = task;

    if (!content || !project_id) {
      return result({ message: "Content and project_id are required!" }, null);
    }

    // Ensure `is_completed` is either false or true
    const completedStatus = is_completed !== undefined ? is_completed : false;
    if (![false, true].includes(completedStatus)) {
      return result({ message: "is_completed must be boolean!" }, null);
    }

    // SQL Update Query (PUT requires all fields)
    const sql = `UPDATE tasks SET content = ?, description = ?, due_date = ?, is_completed = ?, project_id = ? WHERE id = ?`;

    DB.run(
      sql,
      [content, description, due_date || null, completedStatus, project_id, id],
      function (err) {
        if (err) {
          console.error("Error updating task:", err);
          result(err, null);
          return;
        }
        if (this.changes === 0) {
          return result({ kind: "not_found" }, null);
        }

        console.log("Task updated:", { id, ...task });
        result(null, { id, ...task });
      }
    );
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

export { create, update, remove };
