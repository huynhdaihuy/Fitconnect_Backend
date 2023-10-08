const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller');

// router.post('/copyCourse/', courseController.postCopy);
router.post('/', courseController.createCourse);

router.get('/', courseController.getAllCourses);

router.get('/category/:categoryId', courseController.getCourseByCategoryId);

router.get('/coach/:coachId', courseController.getCourseByCoachId);

router.get('/:id', courseController.getCourseById);

router.put('/:id', courseController.updateCourseById);

router.delete('/:id', courseController.deleteCourseById);

module.exports = router;
