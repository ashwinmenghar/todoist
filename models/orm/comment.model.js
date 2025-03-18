import { and, eq, or } from "drizzle-orm";
import db from "../../config/db.js";
import { comments } from "../../schema/schema.js";

// CREATE NEW COMMENTS
const create = async (newComment) => {
  try {
    await db.insert(comments).values(newComment);
    console.log("Comment created successfully");
  } catch (error) {
    throw new Error(error);
  }
};

// UPDATE COMMENT
const update = async (commentId, newComment) => {
  try {
    let commentResponse = await db
      .update(comments)
      .set(newComment)
      .where(eq(commentId, comments.id));

    if (commentResponse.changes === 0) {
      throw new Error(
        `Comment with ID ${commentId} not found or no changes made`
      );
    }

    console.log("Comment update successfully");
    return commentResponse;
  } catch (error) {
    throw new Error(error);
  }
};

// GET COMMENT
const find = async (queries) => {
  const { task_id, project_id } = queries;
  let conditions = [];

  if (task_id !== undefined) {
    conditions.push(eq(comments.task_id, Number(task_id)));
  }

  if (project_id !== undefined) {
    conditions.push(eq(comments.project_id, Number(project_id)));
  }

  try {
    return await db
      .select()
      .from(comments)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
  } catch (error) {
    throw new Error(error);
  }
};

// Delete comment
const remove = async (commentId, result) => {
  try {
    const commentResponse = await db
      .delete(comments)
      .where(eq(commentId, comments.id));

    if (commentResponse.changes === 0) {
      throw new Error(
        `Project with ID ${commentId} not found or no changes made`
      );
    }

    console.log("Comment deleted successfully");
    return commentResponse;
  } catch (error) {
    throw new Error(error);
  }
};

export { create, update, remove, find };
