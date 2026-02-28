import express from "express";
import { Donor, Hospital, Organization } from "../Models/User.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

const router = express.Router();


const getDataController = async (req, res) => {
  try {
    const user = req.user; // comes from authMiddleware
    let userData;

    if (user.role === "donor") {
      userData = await Donor.findById(user.id).select("-password");
    } else if (user.role === "hospital") {
      userData = await Hospital.findById(user.id).select("-password");
    } else if (user.role === "organization") {
      userData = await Organization.findById(user.id).select("-password");
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export{getDataController};

