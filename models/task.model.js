import DB from "../connect.js";

const create = (newTask, result) => {
  let sql = `INSERT INTO tasks (content, description, due_date, is_completed, project_id) VALUES (?, ?, ?, ?, ?)`;

  DB.run(sql, [], function (err) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("task created: ", { id: this.lastID, ...newTask });
    result(null, { id: this.lastID, ...newTask });
  });
};

// UPDATE TASK USING ID
const update = (id, task, result) => {
  let sql = `UPDATE tasks SET content = ?, description = ?, due_date = ?, is_completed = ?, project_id = ? WHERE id = ?`;

  DB.run(sql, [], function (err) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("task updated: ", { id: id, ...task });
    result(null, { id: id, ...task });
  });
};

// DELETE TASK USING ID
const remove = (id, result) => {
  let sql = `DELETE FROM tasks WHERE id = ?`;
  DB.run(sql, [], function (err) {
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
};
