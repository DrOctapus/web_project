const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

const getAllCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
        success: true,
        data: categories
    });
});

module.exports = { getAllCategories };