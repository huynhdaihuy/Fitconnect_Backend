const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");

router.post("", appointmentController.createAppointment);

router.get("", appointmentController.getAllAppointments);

router.get("/:id", appointmentController.getAppointmentById);

router.put("/:id", appointmentController.updateAppointment);

router.delete("/:id", appointmentController.deleteAppointment);

router.get("/customer/:customerId", appointmentController.getAppointmentsByCustomerId);

router.get("/coach/:coachId", appointmentController.getAppointmentsByCoachId);

module.exports = router;
