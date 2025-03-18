import db from "../../config/db.js";
import { comments } from "../../schema/schema.js";
import { DB } from "../utils/connect.js";

// CREATE NEW COMMENTS
const create = async (newComment, result) => {
  try {
    await db.insert(comments).values(newComment);
    console.log("Comment created successfully");
  } catch (error) {}
};

// UPDATE COMMENT
const update = (commentId, newComment, result) => {
  let fields = [];
  let values = [];

  for (const [key, value] of Object.entries(newComment)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  if (fields.length === 0) {
    return result({ message: "No fields provided for update" });
  }

  let sql = `UPDATE comments SET ${fields.join(", ")} WHERE id = ?`;

  DB.run(sql, [...values, commentId], function (err) {
    if (err) {
      result(err);
      return;
    }

    if (this.changes === 0) {
      result({ kind: "not_found" });
      return;
    }

    console.log("Comment updated successfully", newComment);
    result(null, newComment);
  });
};

// GET COMMENT
const find = (req, result) => {
  const { task_id, project_id } = req.query;

  let queries = [];
  let values = [];

  if (task_id) {
    queries.push(`task_id = ?`);
    values.push(Number(task_id));
  }

  if (project_id) {
    queries.push(`project_id = ?`);
    values.push(Number(project_id));
  }

  let sql = `SELECT * FROM comments 
    ${queries.length > 0 ? " WHERE " + queries.join(" AND ") : ""}
  `;

  DB.all(sql, values, function (err, data) {
    if (err) {
      return result(err);
    }

    return result(null, data);
  });
};

// Delete comment
const remove = (commentId, result) => {
  let sql = "DELETE FROM comments WHERE id = ?";

  DB.run(sql, [commentId], function (err) {
    if (err) {
      result(err);
      return;
    }

    if (this.changes === 0) {
      result({ kind: "not_found" });
      return;
    }

    result(null);
    return;
  });
};

export { create, update, remove, find };
