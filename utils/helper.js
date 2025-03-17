// Generic function for error OR success response
export const sendResponse = (res, statusCode, message) => {
  res.status(statusCode).send(message);
};

// Generate created_at date
export const getRandomCreatedAtLastWeek = () => {
  const end = new Date(); // Current date and time
  const start = new Date();
  start.setDate(end.getDate() - 7); // Set start date to 7 days ago

  const randomTimestamp = Math.floor(
    Math.random() * (end.getTime() - start.getTime()) + start.getTime()
  );
  return new Date(randomTimestamp).toISOString().slice(0, 19).replace("T", " ");
};

// Generate due_date
export const getDueDate = (createdAt) => {
  const createdDate = new Date(createdAt);
  createdDate.setDate(createdDate.getDate() + 10); // Add 10 days

  return createdDate.toISOString().slice(0, 19).replace("T", " ");
};

// Run query
export const runQuery = (sql, DB, params = []) => {
  return new Promise((resolve, reject) => {
    DB.run(sql, params, function (err) {
      if (err) {
        console.error(`❌ SQL Error: \n`, err);
        return reject(err.message);
      }
      resolve(this.lastID);
    });
  });
};

export const emailValidation = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
