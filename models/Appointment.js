import mongoose from "mongoose";

const medicinesSchema = new mongoose.Schema({
  name: String,
  frequency: Array,
});

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  dob: {
    type: String,
    require: true,
  },
  timeSlot: {
    type: String,
    require: true,
  },
  problem: {
    type: String,
    require: true,
  },
  videoCallLink: {
    type: String,
    default: "",
  },
  testName: {
    type: String,
    default: "",
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  files: {
    type: [String],
  },
  prescription: {
    default: {},
    type: {
      timestamp: String,
      notes: String,
      medicines: [
        {
          name: String,
          frequency: Array,
        },
      ],
    },
  },
});

export default mongoose.model("Appointment", appointmentSchema);
