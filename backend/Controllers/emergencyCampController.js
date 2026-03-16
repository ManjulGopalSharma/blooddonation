// =============================================================================
// backend/Controllers/emergencyCampController.js
// =============================================================================
// Handles emergency blood requests from hospitals.
//
// Flow:
//   1. Hospital submits emergency request (patientName, bloodType, units, reason)
//   2. Request is saved to MongoDB
//   3. Eligible donors in same city are found (compatible blood group + 3 month wait)
//   4. Donors sent to Flask ML server for probability scoring
//   5. Ranked donor list returned to frontend
// =============================================================================

import EmergencyRequest from '../Models/emergencyModel.js';
import { Donor }        from '../Models/User.js';
import { rankDonorsByProbability } from '../Utils/mlService.js';

// =============================================================================
// Blood group compatibility map
// Returns all blood groups that can donate to the needed blood group
// =============================================================================

const getCompatibleGroups = (needed) => {
  const map = {
    'A+':  ['A+', 'A-', 'O+', 'O-'],
    'A-':  ['A-', 'O-'],
    'B+':  ['B+', 'B-', 'O+', 'O-'],
    'B-':  ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+':  ['O+', 'O-'],
    'O-':  ['O-'],
  };
  return map[needed] || [needed];
};

// =============================================================================
// POST /dashboard-hospital/emergency-request
// =============================================================================

export const emergencyRequest = async (req, res) => {
  try {
    const { patientName, bloodType, units, reason } = req.body;

    // Validate required fields
    if (!patientName || !bloodType || !units || !reason) {
      return res.status(400).json({
        message: 'Fill all the required fields',
      });
    }

    // ── 1. Save emergency request to MongoDB ──────────────────────────────
    const emergency = await EmergencyRequest.create({
      patientName,
      bloodType,
      units,
      reason,
      hospitalId:       req.user._id,
      hospitalName:     req.user.hospitalName,
      hospitalCity:     req.user.city,
      hospitalDistrict: req.user.district,
    });

    // ── 2. Find eligible donors in same city ──────────────────────────────
    // Eligible = compatible blood group + last donated more than 3 months ago
    // (Medical rule: donors must wait at least 3 months between donations)

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const compatibleGroups = getCompatibleGroups(bloodType);

    const donors = await Donor.find({
      city:       req.user.city,
      bloodGroup: { $in: compatibleGroups },
      $or: [
        { lastDonated: { $lt: threeMonthsAgo } }, // donated 3+ months ago
        { lastDonated: null },                      // never donated
        { lastDonated: { $exists: false } },        // field not set
      ],
    })
      .select(
        'userName email bloodGroup city ' +
        'monthsSinceFirstDonation numberOfDonation pintsDonated lastDonated'
      )
      .lean();

    // ── 3. No donors found — return early ─────────────────────────────────
    if (donors.length === 0) {
      return res.status(200).json({
        message:       'Emergency request saved. No eligible donors found in your city.',
        emergency,
        total_donors:  0,
        ranked_donors: [],
      });
    }

    // ── 4. Send donors to Flask ML server for probability scoring ─────────
    const mlResult = await rankDonorsByProbability(
      req.user.city,
      bloodType,
      donors
    );

    // ── 5. Return everything to frontend ──────────────────────────────────
    return res.status(200).json({
      message:         'Emergency request submitted successfully',
      emergency,
      total_donors:    mlResult.total_donors,
      high_priority:   mlResult.high_priority,
      medium_priority: mlResult.medium_priority,
      low_priority:    mlResult.low_priority,
      ranked_donors:   mlResult.ranked_donors,
      ml_fallback:     mlResult.fallback || false,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// =============================================================================
// GET /donor/emergency-notifications?city=Lalitpur
// =============================================================================
// Used by the donor dashboard notification bell to show
// emergency requests in the donor's city

export const getEmergencyRequest = async (req, res) => {
  const { city } = req.query;
  try {
    const emergency = city
      ? await EmergencyRequest.find({ hospitalCity: city }).sort({ createdAt: -1 })
      : await EmergencyRequest.find().sort({ createdAt: -1 });

    res.status(200).json({ data: emergency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};