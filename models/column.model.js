import { DB } from "../utils/connect.js";

// CREATE NEW COMMENTS
const create = (newComment, result) => {
  let sql = `INSERT INTO comments (content, email, project_id, task_id) VALUES (?, ?, ?, ?)`;

  DB.run(sql, newComment, function (err) {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: this.lastID, ...newComment });
    return;
  });
};

// UPDATE COMMENT
const update = (commentId, newComment, result) => {
  let sql = `UPDATE comments SET content = ?, email = ?, project_id =? , task_id = ? WHERE id = ?`;
  DB.get(sql, [...newComment, commentId], function (err) {
    if (err) {
      result(err);
      return;
    }

    if (this.changes === 0) {
      result({ kind: "not_found" });
      return;
    }

    console.log("Comment update successfully", newComment);

    result(null, newComment);
    return;
  });
};

// Delete comment
const remove = (commentId, result) => {
  let sql = "DELETE comments WHERE id = ?";
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

export { create, update, remove };
