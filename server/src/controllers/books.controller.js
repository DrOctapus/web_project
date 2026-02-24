const Book = require('../models/Book');
const asyncHandler = require('express-async-handler');

const getBook = asyncHandler(async (req, res, next) => {
    if (req.query.limit) {
        const limit = parseInt(req.query.limit);
        const books = await Book.aggregate([
            { $sample: { size: limit } }
        ]);
        return res.status(200).json({
            success: true,
            data: books
        });

    }
    const filters = req.bookFilters || {};
    // console.log('Final Filters applying to Books:', JSON.stringify(filters, null, 2));
    const books = await Book.find(filters).populate('course', 'title');

    res.status(200).json({
        success: true,
        data: books
    });
});

module.exports = { getBook };