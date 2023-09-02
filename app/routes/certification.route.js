const express = require('express');
const router = express.Router();

const certificationController = require('../controllers/certification.controller'); 

// Define routes
router.post('/', certificationController.createCertification);
router.get('/', certificationController.getAllCertifications);
router.put('/:id', certificationController.updateCertification);
router.delete('/:id', certificationController.deleteCertification);

module.exports = router;
