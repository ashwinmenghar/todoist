import DB from "../connect.js";

const create = (newproject, result) => {
  let sql = `INSERT INTO projects (name, color, is_favorite) VALUES (?, ?, ?)`;

  DB.run(sql, [], function (err) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Project created: ", { id: this.lastID, ...newproject });
    result(null, { id: this.lastID, ...newproject });
  });
};

// UPDATE PROJECT USING ID
const update = (id, project, result) => {
  let sql = `UPDATE projects SET name = ?, color = ?, is_favorite = ? WHERE id = ?`;

  DB.run(sql, [...project], function (err) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Project updated: ", { id: id, ...project });
    result(null, { id: id, ...project });
  });
};

// DELETE PROJECT USING ID
const remove = (id, result) => {
  let sql = `DELETE FROM projects WHERE id = ?`;
  DB.run(sql, [], function (err) {
    if (err) {
      console.error("Error deleting project:", err);
      result(err, null);
      return;
    }

    if (this.changes === 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Deleted project with id:", id);
    result(null, { message: "Project deleted successfully!" });
  });
};

// GET A PROJECT BY ID
const findById = (id, result) => {
  let sql = `SELECT id, name, color, is_favorite FROM projects WHERE id = ?`;

  DB.get(sql, [id], function (err, res) {
    if (err) {
      console.log("Error ", err);
      result(err, null);
      return;
    }

    if (res) {
      console.log("found tutorial: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

export { create, remove, update, findById };
