const Course = require('../models/Course')
const asyncHandler = require('express-async-handler');

// Get courses with optional filters
const getCourses = asyncHandler(async (req, res, next) => {
    const filters = req.courseFilters || {};
    const courses = await Course.find(filters)
        .populate('category', 'name');
    res.status(200).json({
        success: true,
        data: courses
    });
});

// Get course by ID occurs when we see course details page
const getCourseById = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)
        .populate('category', 'name')
        .populate({
            path: 'books',
            select: 'title description coverImage'
        });

    if (!course) {
        const error = new Error('Course not found');
        error.statusCode = 404;
        return next(error);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

module.exports = {
    getCourses,
    getCourseById
}