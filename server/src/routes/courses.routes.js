const express = require('express');
const router = express.Router();
const { getCourses, getCourseById } = require('../controllers/courses.controller');
const { validateCourseQuery } = require('../middleware/validateRequest');

router.get('/', validateCourseQuery, getCourses);
router.get('/:id', validateCourseQuery, getCourseById);

module.exports = router;