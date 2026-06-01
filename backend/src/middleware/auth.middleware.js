import jwt from "jsonwebtoken";

const unauthorized = (res, message = "Unauthorized") =>
  res.status(401).json({
    success: false,
    message,
    data: null,
  });

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.split(" ")[1] : null;

  if (!token) {
    return unauthorized(res, "Token tidak ditemukan");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return unauthorized(res, "Token tidak valid");
  }
};
