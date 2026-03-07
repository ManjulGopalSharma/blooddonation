import mongoose from "mongoose";

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

    donatedBlood: { type: Number, default: 0 },
    
  },
  { timestamps: true }
);

const Donor = mongoose.model("Donor", donorSchema);

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
    streetAddress: {        // ← added
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);

export { Donor, Hospital, Organization };