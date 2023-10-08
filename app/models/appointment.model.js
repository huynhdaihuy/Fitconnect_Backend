const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    fromCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Assuming you have a 'Customer' model
      required: true,
    },
    toCoach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    type: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    place: {
      type: String,
      required: function () {
        return this.type === "offline";
      },
    },
    time: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled"],
      default: "scheduled",
    },
    description: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
