const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for debbugging
    console.error(err.stack);

    // Mongoose bad ObjectId (when given id is not valid)
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error.message = message;
        error.statusCode = 404;
    }

    // Mongoose duplicate key (when unique field is duplicated)
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error.message = message;
        error.statusCode = 400;
    }

    // Mongoose validation error (when a required field is missing or invalid)
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error.message = message;
        error.statusCode = 400;
    }

    // General server error response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;