const express = require('express');
const { protectedRoute, restrictTo } = require('../controllers/authController');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasCheapTours,
  getTourStats,
  getMonthlyPlan,
  getTourWithin,
  getDistances,
} = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top5-cheap-tours').get(aliasCheapTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    protectedRoute,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan,
  );
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getTourWithin);
router.route('/distances/:latlng/unit/:unit').get(getDistances);
router
  .route('/')
  .get(getAllTours)
  .post(protectedRoute, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(protectedRoute, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protectedRoute, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
