import express from "express";
import { Donor, Hospital,Organization } from'../Models/User.js';
import authMiddleware from "../Middlewares/authMiddleware.js";


const router = express.Router();

// Save user location
router.put("/location",authMiddleware, async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Coordinates required" });
  }

  try {
    const user = req.user; // from authMiddleware
   
    if (user.role === "donor") {
      await Donor.findByIdAndUpdate(user.id, {
        location: { latitude, longitude },
      });
    } else if (user.role === "hospital") {
      await Hospital.findByIdAndUpdate(user.id, {
        location: { latitude, longitude },
      });
    }else if (user.role === "organization") {
      await Organization.findByIdAndUpdate(user.id, {
        location: { latitude, longitude },
      });
    }
    
    else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(200).json({ message: "Location updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/location", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // from JWT
    let locationData;

    if (user.role === "donor") locationData = await Donor.findById(user.id, "location");
    else if (user.role === "hospital") locationData = await Hospital.findById(user.id, "location");
    else if (user.role === "organization") locationData = await Organization.findById(user.id, "location");
    else return res.status(400).json({ message: "Invalid user role" });

    if (!locationData || !locationData.location)
      return res.status(404).json({ message: "Location not found" });

    res.status(200).json(locationData.location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
