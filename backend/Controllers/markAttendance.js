// =============================================================================
// backend/Controllers/markAttendance.js
// =============================================================================
// Marks donor attendance at a blood donation camp.
//
// What this does:
//   1. Marks the camp registration as "Completed"
//   2. Updates donor.lastDonated                  ← existing
//   3. Increments donor.donatedBlood              ← existing
//   4. Increments donor.numberOfDonation          ← NEW (used by ML model)
//   5. Increments donor.pintsDonated by 2         ← NEW (used by ML model)
//   6. Updates donor.monthsSinceFirstDonation     ← NEW (used by ML model)
//
// Steps 4, 5, 6 are needed so the ML model has accurate behavioral data
// the next time an emergency request queries this donor.
// =============================================================================

import CampRegistration from '../Models/RegisterCamp.js';
import { Donor }        from '../Models/User.js';

export const markAttendance = async (req, res) => {
  try {
    let { registrationIds } = req.body;

    if (!registrationIds || registrationIds.length === 0) {
      return res.status(400).json({ message: 'Please select donor' });
    }

    if (!Array.isArray(registrationIds)) {
      registrationIds = [registrationIds];
    }

    const today      = new Date();
    let updatedCount = 0;

    for (const id of registrationIds) {

      // ── 1. Mark registration as Completed ────────────────────────────
      const registration = await CampRegistration.findOneAndUpdate(
        { _id: id, registrationStatus: { $ne: 'Completed' } },
        { $set: { registrationStatus: 'Completed' } },
        { new: true }
      );

      if (!registration) continue;

      // ── 2. Get donor document ─────────────────────────────────────────
      const donor = await Donor.findById(registration.donorId);

      if (!donor) continue;

      // ── 3. Calculate months since first donation ──────────────────────
      // Use donor.createdAt as the proxy for first donation date
      // (when they first registered on the platform)
      const firstDate    = new Date(donor.createdAt);
      const monthsSince  = Math.floor(
        (today - firstDate) / (1000 * 60 * 60 * 24 * 30)
      );

      // ── 4. Update all donation tracking fields ────────────────────────
      donor.lastDonated              = today;                           // existing
      donor.donatedBlood             = (donor.donatedBlood  || 0) + 1; // existing
      donor.numberOfDonation         = (donor.numberOfDonation  || 0) + 1; // NEW
      donor.pintsDonated             = (donor.pintsDonated  || 0) + 2; // NEW (2 pints per donation)
      donor.monthsSinceFirstDonation = monthsSince;                    // NEW

      await donor.save();
      updatedCount++;
    }

    if (updatedCount === 0) {
      return res.status(400).json({
        message: 'No new attendance to mark. All already completed.',
      });
    }

    res.status(200).json({
      message:      'Attendance marked successfully',
      updatedCount,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error marking attendance' });
  }
};