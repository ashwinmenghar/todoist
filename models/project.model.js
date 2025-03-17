import { DB } from "../utils/connect.js";
import { sendResponse } from "../utils/helper.js";

// CREATE A PROJECT
const create = (newproject, result) => {
  let sql = `INSERT INTO projects (name, color, is_favorite) VALUES (?, ?, ?)`;

  DB.run(
    sql,
    [newproject.name, newproject.color, newproject.is_favorite],
    function (err) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("Project created: ", { id: this.lastID, ...newproject });
      result(null, { id: this.lastID, ...newproject });
    }
  );
};

// UPDATE PROJECT USING ID
const update = (id, project, result) => {
  let filters = [];
  let values = [];

  Object.keys(project).forEach((key) => {
    filters.push(`${key} = ?`);
    values.push(project[key]);
  });

  let sql = `UPDATE projects SET ${filters.join(", ")} WHERE id = ?`;
  // let sql = `UPDATE projects SET name = ?, color = ?, is_favorite = ? WHERE id = ?`;

  DB.run(sql, [values, id], function (err, data) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (this.changes === 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Project updated: ", { id: id, ...project });
    result(null, { id: id, ...project });
  });
};

// DELETE PROJECT USING ID
const remove = (id, result) => {
  let sql = `DELETE FROM projects WHERE id = ?`;

  DB.run(sql, [id], function (err) {
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

// REMOVE ALL PROEJECTS
const removeAll = (result) => {
  let sql = `DELETE FROM projects`;
  DB.run(sql, [], function (err) {
    if (err) {
      console.error("Error deleting projects:", err);
      result(err);
      return;
    }

    console.log("Deleted all projects");
    result(null);
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
      console.log("found project: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

// GET ALL PROJECTS
const findAll = (req, result) => {
  let page = req.query["page"] ? Number(req.query["page"]) : 1;
  let limit = 1000;

  let sql = `SELECT * FROM projects  LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;

  DB.all(sql, [], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("projects: ", res);
    result(null, res);
  });
};

export { create, remove, removeAll, update, findById, findAll };
