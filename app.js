const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
// Global Middlewares
// Set security HTTP header
app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later in an hour'
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter polution
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price']
}));

app.use((req, res, next) =>
{
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
})

//ROUTES
app.use('/api/tours', tourRoute);
app.use('/api/users', userRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/bookings', bookingRouter);

app.use('/', viewRouter);

app.all('*', (req, res, next) =>
{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;