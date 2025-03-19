import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const getToken = (req) => {
  const authHeader =
    req.headers["Authorization"] ?? req.headers["authorization"];

  if (authHeader) {
    const headerSplit = authHeader.split("Bearer ");
    if (headerSplit.length === 2) {
      const token = headerSplit[1];
      return token;
    }
  }

  return null;
};

export const verifyToken = (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json("You are not authenticated!");
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    req.user = data;

    next();
  });
};
