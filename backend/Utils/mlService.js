// =============================================================================
// backend/Utils/mlService.js
// =============================================================================
// Bridge between Express backend and the Flask ML server.
// Called during emergency blood requests to rank donors by probability.
//
// Flow:
//   Express (emergencyCampController.js)
//       ↓
//   rankDonorsByProbability()  ← this file
//       ↓
//   Flask ML server (app.py) at http://localhost:5001/predict-batch
//       ↓
//   Returns ranked donors sorted by probability (highest first)
// =============================================================================

import axios from 'axios';

const ML_URL = process.env.ML_URL || 'http://localhost:5001';

// =============================================================================
// rankDonorsByProbability
// =============================================================================
// Sends a list of donors to the Flask ML server and gets back
// a ranked list sorted by probability of donating blood.
//
// @param {string} hospitalCity   - city from the hospital's MongoDB document
// @param {string} bloodGroup     - blood group needed e.g. 'A+', 'O-'
// @param {Array}  donors         - donor documents from MongoDB
// @returns {Object}              - ranked donors with probabilities
// =============================================================================

export const rankDonorsByProbability = async (hospitalCity, bloodGroup, donors) => {
  try {
    const response = await axios.post(
      `${ML_URL}/predict-batch`,
      {
        hospital_city:      hospitalCity,
        blood_group_needed: bloodGroup,

        // Map MongoDB donor fields to what Flask expects
        donors: donors.map(d => ({
          email:                        d.email,
          username:                     d.userName,
          blood_group:                  d.bloodGroup,
          months_since_first_donation:  d.monthsSinceFirstDonation || 0,
          number_of_donation:           d.numberOfDonation          || 0,
          pints_donated:                d.pintsDonated              || 0,
        }))
      },
      { timeout: 15000 }
    );

    return response.data;

  } catch (error) {
    console.error('[mlService] Flask server unreachable:', error.message);

    // Graceful fallback — if Flask is down, return donors unranked
    // The emergency system still works, just without ML ranking
    return {
      hospital_city:   hospitalCity,
      total_donors:    donors.length,
      high_priority:   0,
      medium_priority: donors.length,
      low_priority:    0,
      fallback:        true,
      message:         'ML server unavailable — donors returned unranked',
      ranked_donors:   donors.map((d, i) => ({
        rank:        i + 1,
        email:       d.email,
        username:    d.userName,
        blood_group: d.bloodGroup,
        probability: 0.5,
        priority:    'MEDIUM',
        label:       'Unknown'
      }))
    };
  }
};