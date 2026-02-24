const validateBookQuery = (req, res, next) => {

    const { limit, title, publisher, course, inStock, maxPublishedYear } = req.query;

    if (limit !== undefined) {
        const parsedLimit = parseInt(limit);
        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid limit parameter. It must be a positive integer.'
            });
        }
        req.query.limit = parsedLimit;
        // if there is a limit parameter there shouldn't be any filters with the current app design
        // because limit is only used to get random samples on the landing page
        return next();
    }
    const filters = {};

    if (title) filters.title = { $regex: title, $options: 'i' };
    if (publisher) filters.publisher = publisher;
    if (inStock === 'true') filters.stock = { $gt: 0 };
    if (maxPublishedYear) {
        const year = parseInt(maxPublishedYear);
        if (isNaN(year) || year < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid maxPublishedYear parameter.'
            });
        }
        filters.publicationYear = { $lte: year };
    }
    if (course) {
        const courseIds = course.split(',');
        for (let courseId of courseIds) {
            if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Course ID"
                });
            }
        }
        filters.course = { $in: courseIds };
    }

    req.bookFilters = filters;
    return next();
}

const validateCourseQuery = (req, res, next) => {
    // If there is a course id parameter (course/:id) there should be no other filters
    if (req.params.id) {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Course ID format'
            });
        }
        return next();
    }
    // No courseId parameter, proceed with filters
    const { category, maxDuration, maxDifficulty, title } = req.query;
    const filters = {};

    if (category) {
        const categoryIds = category.split(',');
        for (let categoryId of categoryIds) {
            if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Category ID"
                });
            }
        }
        filters.category = { $in: categoryIds };
    }
    if (maxDuration) {
        const duration = parseInt(maxDuration);
        if (isNaN(duration) || duration <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid maxDuration parameter.'
            });
        }
        filters.duration = { $lte: duration };
    }
    if (maxDifficulty) {
        const difficulty = parseInt(maxDifficulty);
        if (isNaN(difficulty) || difficulty < 1 || difficulty > 3) {
            return res.status(400).json({
                success: false,
                message: 'Invalid maxDifficulty parameter.'
            });
        }
        filters.difficulty = { $lte: difficulty };
    }
    if (title) filters.title = { $regex: title, $options: 'i' };

    req.courseFilters = filters;
    return next();
};

const validateRegister = (req, res, next) => {
    const { fname, lname, email, password, dateOfBirth } = req.body;

    if (!fname || !lname || !email || !password || !dateOfBirth) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required.'
        });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format.'
        });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid password. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.'
        });
    }

    if (isNaN(Date.parse(dateOfBirth))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid date of birth format.'
        });
    }

    // Calculate Age
    const age = Date.now() - new Date(dateOfBirth).getTime()

    // (365.25 days (.25 due to 1/4 leap years) * 24 hours * 60 min * 60 sec * 1000 ms)
    const msInYear = 365.25 * 24 * 60 * 60 * 1000

    if (age < 16 * msInYear || age > 120 * msInYear) {
        return res.status(400).json({
            success: false,
            message: 'Registration failed. Age must be between 16 and 120 years old. (Current age: ${Math.round(age / msInYear)})'
        })
    }

    return next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.'
        });
    }

    return next();
};

const validateEmailCheck = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    return next();
};

module.exports = { validateBookQuery, validateCourseQuery, validateRegister, validateLogin, validateEmailCheck };