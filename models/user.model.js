import { DB } from "../utils/connect.js";

// CREATE NEW USER
const create = (newUser, result) => {
  let sql = `INSERT INTO users (name, email) VALUES (?, ?)`;

  DB.run(sql, newUser, function (err) {
    if (err) {
      console.log("Error create user:", err);
      result(err, null);
      return;
    }

    console.log("User created:", { id: this.lastID, ...newUser });
    result(null, { id: this.lastID, ...newUser });
  });
};

// UPDATE USER
const update = (userId, userData, result) => {
  let sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  const { name, email } = userData;

  DB.run(sql, [name, email, userId], function (err) {
    if (err) {
      console.log("Error updating user:", err);
      result(err, null);
      return;
    }

    if (this.changes == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("User update successfully", { id: userId, ...userData });
    result(null, { id: userId, ...userData });
  });
};

// DELETE USER
const remove = (id, result) => {
  let sql = `DELETE FROM users WHERE id = ?`;

  DB.run(sql, [id], function (err) {
    if (err) {
      console.log("Error deleting user:", err);
      result(err);
      return;
    }

    if (this.changes === 0) {
      result({ kind: "not_found" });
      return;
    }

    console.log("User deleted successfully");
    result(null);
    return;
  });
};

// FIND FIELD FOR VALIDATION
const findByField = (field, value, result) => {
  let sql = `SELECT * FROM users WHERE ${field} = ?`;
  DB.get(sql, [value], function (err, row) {
    if (err || !row) {
      result(false, null);
      return;
    }
    result(true, row);
  });
};

export { create, update, remove, findByField };
