import jwt from "jsonwebtoken";
import { Donor, Hospital, Organization } from "../Models/User.js";

export default async function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;

    
    if (decoded.role === "donor") {
      user = await Donor.findById(decoded.id).select("-password");
    } else if (decoded.role === "hospital") {
      user = await Hospital.findById(decoded.id).select("-password");
    } else if (decoded.role === "organization") {
      user = await Organization.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; 
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}