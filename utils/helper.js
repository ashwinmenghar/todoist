// Generic function for error OR success response
export const sendResponse = (res, statusCode, message) => {
  res.status(statusCode).send({ message });
};
