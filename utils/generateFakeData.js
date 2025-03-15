import { DB } from "./connect.js";
import { getDueDate, getRandomCreatedAtLastWeek, runQuery } from "./helper.js";

// Batch insertion
const batchInsert = async (table, columns, valuesList, batchSize = 5000) => {
  if (!valuesList.length) return;

  try {
    await runQuery("BEGIN TRANSACTION;", DB);

    for (let i = 0; i < valuesList.length; i += batchSize) {
      let batch = valuesList.slice(
        i,
        i + Math.min(valuesList.length, batchSize)
      );

      let placeholders = batch
        .map(() => `(${columns.map(() => "?").join(",")})`)
        .join(", ");

      let sql = `INSERT into ${table} (${columns.join(
        ", "
      )}) VALUES ${placeholders}`;

      try {
        await runQuery(sql, DB, batch.flat());
      } catch (error) {
        // console.error(`❌ Error inserting batch into ${table}:`, error);
        throw new Error(error);
      }
    }

    await runQuery("COMMIT;", DB);
  } catch (error) {
    await runQuery("ROLLBACK;", DB);
    // console.error(`❌ Transaction rollback in ${table}:`, error);
    throw new Error(error);
  }
};

// Generate data for insertion
const generateData = async (userCount, projectCount, taskCount) => {
  console.log("\n🚀 Generating Data...");

  try {
    // Insert users
    let users = Array.from({ length: userCount }, (_, i) => [
      (Math.random() + 1).toString(36).substring(7),
      `${i}@test.com`,
    ]);

    await batchInsert("users", ["name", "email"], users);

    // Insert Projects
    let projects = Array.from({ length: projectCount }, (_, i) => [
      (Math.random() + 1).toString(36).substring(7),
      `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      Math.round(Math.random()),
      Math.floor(Math.random() * userCount) + 1,
    ]);

    await batchInsert(
      "projects",
      ["name", "color", "is_favorite", "user_id"],
      projects
    );

    const taskBatchSize = 1000000; // Insert 100,000 tasks at a time
    for (let i = 0; i < taskCount; i += taskBatchSize) {
      let tasks = Array.from(
        { length: Math.min(taskBatchSize, taskCount - i) },
        (_, j) => {
          let createdAt = getRandomCreatedAtLastWeek();
          let dueDate = getDueDate(createdAt);
          return [
            (Math.random() + 1).toString(36).substring(3),
            "Description for task " + (i + j + 1),
            dueDate,
            Math.random() > 0.5,
            createdAt,
            Math.floor(Math.random() * projectCount) + 1,
          ];
        }
      );

      await batchInsert(
        "tasks",
        [
          "content",
          "description",
          "due_date",
          "is_completed",
          "created_at",
          "project_id",
        ],
        tasks
      );

      console.log(`Inserted ${i + tasks.length}/${taskCount} tasks...`);
    }

    console.log("✅ Data Generation Completed.");
  } catch (error) {
    throw new Error(error);
    // console.error("❌ Error in Data Generation:", error);
  }
};

try {
  let start = performance.now();
  await generateData(10, 1000000, 10000000);

  console.log(`total time is ${performance.now() - start} ms`);
} catch (error) {
  console.error(error.message);
}
