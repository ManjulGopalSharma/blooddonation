import mongoose from "mongoose";

const campSchema = new mongoose.Schema(
  {
    campTitle: {
      type: String,
      required: true,
      trim: true,
    },

    campDescription: {
      type: String,
      trim: true,
    },

    streetAddress: {
      type: String,
      required: true,
      trim: true,
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

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    expectedDonors: {
      type: Number,
      required: true,
      min: 1,
    },

    registeredCount: {
      type: Number,
      default: 0,
    },

    coordinatorName: {
      type: String,
      required: true,
      trim: true,
    },

    coordinatorContact: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
     hospitalName: {
      type: String,
      required: true,
    },
    hospitalProvince: {
      type: String,
      required: true,
    },
    hospitalDistrict: {
      type: String,
      required: true,
    },
    hospitalCity: {
      type: String,
      required: true,
    },
     status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled", ],
      default: "Upcoming",
    },

  },
  { timestamps: true }
);

export const Camp = mongoose.model("Camp", campSchema);