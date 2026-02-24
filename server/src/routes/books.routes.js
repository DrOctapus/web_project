const express = require('express');
const router = express.Router();
const { getBook } = require('../controllers/books.controller');
const { validateBookQuery } = require('../middleware/validateRequest');

router.get('/', validateBookQuery, getBook);

module.exports = router;