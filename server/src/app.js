const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//define express
const app = express();

//COMMON MIDDLEWARE

//cors
app.use(cors());

//set security http headers
app.use(helmet());

//logger middlware
if (process.env.NODE_ENV === 'development') {
  //restrict logger if it's not development
  app.use(morgan('dev'));
}

//request limiter from a IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests from this IP, please try again after some time',
});
app.use('/api', limiter);

//adding requestTime to all request automatically
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//body parser
app.use(express.json({ limit: '10kb' }));

//data sanitization against NOSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//prevent param pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//static file server
app.use(express.static(`${__dirname}/public`));

//router middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/', userRouter);

//unhandled routes
app.all('*', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server!!!`, 404)),
);

//global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
