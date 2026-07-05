import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    punchIn: {
      type: Date,
      required: true,
    },
    punchOut: {
      type: Date,
    },
    selfieUrl: {
      type: String,
      required: true,
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    workingHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "valid", "invalid"],
      default: "pending",
    },
    remarks: {
      type: String,
      default: "",
    },
    overtimeStatus: {
      type: String,
      enum: ["none", "requested", "approved", "rejected"],
      default: "none",
    },
    overtimeHours: {
      type: Number,
      default: 0,
    },
    otRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OTRequest",
    },
  },
  { timestamps: true }
);

// Compound index to ensure an employee only has one attendance record per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
