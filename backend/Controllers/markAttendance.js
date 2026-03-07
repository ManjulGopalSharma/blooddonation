import CampRegistration from "../Models/RegisterCamp.js";
import { Donor } from "../Models/User.js";

export const markAttendance = async (req, res) => {
  try {
    let { registrationIds } = req.body;

    if (!registrationIds || registrationIds.length === 0) {
      return res.status(400).json({ message: "registrationIds is required" });
    }

    if (!Array.isArray(registrationIds)) {
      registrationIds = [registrationIds];
    }

    const today = new Date();
    let updatedCount = 0;

    for (const id of registrationIds) {
      // Atomically update registration only if not completed
      const registration = await CampRegistration.findOneAndUpdate(
        { _id: id, registrationStatus: { $ne: "Completed" } }, // only if not completed
        { $set: { registrationStatus: "Completed" } },
        { new: true } // return the updated document
      );

      if (!registration) continue; 

      
      await Donor.findByIdAndUpdate(
        registration.donorId,
        { $inc: { donatedBlood: 1 }, $set: { lastDonated: today } }
      );

      updatedCount++;
    }

    if (updatedCount === 0) {
      return res.status(400).json({
        message: "No new attendance to mark. All already completed."
      });
    }

    res.status(200).json({ message: "Attendance updated", updatedCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error marking attendance" });
  }
};