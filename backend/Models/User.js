import mongoose from "mongoose";

// =============================================================================
// DONOR SCHEMA
// =============================================================================

const donorSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      default: "donor",
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    lastDonated: {
      type: Date,
      required: false,
    },

    // ── Donation tracking (updated when attendance is marked) ──
    donatedBlood: {
      type: Number,
      default: 0,
    },

    // ── ML model fields ────────────────────────────────────────
    // These 3 fields are used by the Flask ML server to predict
    // whether a donor is likely to respond to an emergency request.
    // They are updated automatically every time a donor's attendance
    // is marked at a blood donation camp.

    numberOfDonation: {
      // Total number of times this donor has donated
      type: Number,
      default: 0,
    },
    pintsDonated: {
      // Total pints donated across all sessions
      type: Number,
      default: 0,
    },
    monthsSinceFirstDonation: {
      // How many months since their very first donation
      // Used to calculate avg_gap and donation_frequency in the ML model
      type: Number,
      default: 0,
    },

    certificate: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Donor = mongoose.model("Donor", donorSchema);

// =============================================================================
// HOSPITAL SCHEMA
// =============================================================================

const hospitalSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      default: "hospital",
    },
    hospitalName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    contactPersonNumber: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

// =============================================================================
// ORGANIZATION SCHEMA
// =============================================================================

const organizationSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      default: "organization",
    },
    organizationName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    contactPersonNumber: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);

export { Donor, Hospital, Organization };