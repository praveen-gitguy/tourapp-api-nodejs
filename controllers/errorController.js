const AppError = require('./../utils/appError');

const handleCastErrorDB = err =>
{
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err =>
{
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `Duplicate field value: ${value[0]}. Please use another value.`
    return new AppError(message, 400);
}

const handleValidationErrorDB = err =>
{
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = err => new AppError('Invalid token.Please login again', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please login again', 401);

const sendErrorDev = (err, req, res) =>
{
    if (!req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        })
    }
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, req, res) =>
{

    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('Error 💥');
        res.status(500).json({
            status: 'error',
            message: 'Something gone wrong'
        });
    }
}

module.exports = (err, req, res, next) =>
{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV == "production") {
        let error = { ...err };
        error.message = err.message;
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, req, res);
    }
}

