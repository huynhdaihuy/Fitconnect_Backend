const Appointment = require("../models/appointment.model");
const ObjectId = require("mongoose").Types.ObjectId;

exports.createAppointment = async function (req, res) {
  try {
    const { fromCustomer, toCoach, type, place, time, status, description, notes } = req.body;

    if (!ObjectId.isValid(fromCustomer) || !ObjectId.isValid(toCoach)) {
      return res
        .status(400)
        .json({ error: "Invalid fromCustomer or toCoach ID" });
    }

    const appointment = new Appointment({
      fromCustomer,
      toCoach,
      type,
      place,
      time,
      status,
      description,
      notes,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// Get all appointments
exports.getAllAppointments = async function (req, res) {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

exports.getAppointmentById = async function (req, res) {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};


exports.updateAppointment = async function (req, res) {
  try {
    const { fromCustomer, toCoach, type, place, time, status, description, notes } = req.body;

    if (!ObjectId.isValid(fromCustomer) || !ObjectId.isValid(toCoach)) {
      return res
        .status(400)
        .json({ error: "Invalid fromCustomer or toCoach ID" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        fromCustomer,
        toCoach,
        type,
        place,
        time,
        status,
        description,
        notes,
      },
      { new: true } 
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

exports.deleteAppointment = async function (req, res) {
  try {
    const deletedAppointment = await Appointment.findByIdAndRemove(req.params.id);
    
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(204).end(); 
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};
