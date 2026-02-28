import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // attach user info
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
  next();
}
