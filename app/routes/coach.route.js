const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coach.controller');

// Create a new coach
router.post('/', coachController.createCoach);

// Update a coach by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const coach = await coachController.updateCoach(id, newData);
    res.status(200).send({ message: 'Coach updated successfully.', coach });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error occurred.' });
  }
});

// Delete a coach by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await coachController.deleteCoach(id);
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error occurred.' });
  }
});

// Delete all coaches
router.delete('/', async (req, res) => {
  try {
    const result = await coachController.deleteAllCoaches();
    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error occurred.' });
  }
});

// Get a coach by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const coach = await coachController.getCoachById(id);
    res.json(coach);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error occurred.' });
  }
});

// Get all coaches
router.get('/', async (req, res) => {
  try {
    const coaches = await coachController.getCoaches();
    res.json(coaches);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error occurred.' });
  }
});

// Compare coach password
router.post('/:id/compare-password', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const isMatch = await coachController.compareCoachPassword(id, password);
    res.json({ isMatch });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error occurred.' });
  }
});

module.exports = router;
