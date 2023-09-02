const Certification = require("../models/certification.model");
const Coach = require("../models/coach.model");
// Create a new certification
exports.createCertification = async function (req, res) {
  try {
    const {
      issued_place,
      issue_date,
      name,
      type,
      expiration_date,
      major_id,
      coach_id,
    } = req.body;

    const certification = new Certification({
      issued_place,
      issue_date,
      name,
      expiration_date,
      major: major_id,
      type,
      coach_id,
    });
    await certification.save();
    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ error: "Failed to create certification" });
  }
};

// Get all certifications
exports.getAllCertifications = async function (req, res) {
  try {
    const certifications = await Certification.find()
      .populate("major", "name") // Populate the 'major' field with the 'name' property
      .populate("coach_id", "name"); // Populate the 'coach_id' field with the 'name' property
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve certifications" });
  }
};

// Update a certification
exports.updateCertification = async function (req, res) {
  try {
    const certificationId = req.params.id;
    const updates = req.body;
    const options = { new: true }; // Return the updated certification

    const updatedCertification = await Certification.findByIdAndUpdate(
      certificationId,
      updates,
      options
    );

    if (!updatedCertification) {
      return res.status(404).json({ error: "Certification not found" });
    }

    res.json(updatedCertification);
  } catch (error) {
    res.status(500).json({ error: "Failed to update certification" });
  }
};

// Delete a certification
exports.deleteCertification = async function (req, res) {
  try {
    const certificationId = req.params.id;
    const deletedCertification = await Certification.findByIdAndDelete(
      certificationId
    );

    if (!deletedCertification) {
      return res.status(404).json({ error: "Certification not found" });
    }

    res.json({ message: "Certification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete certification" });
  }
};
