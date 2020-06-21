const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

router.use('/:tourId/reviews', reviewRouter);

router
    .route('/tour-stats')
    .get(tourController.getTourStats);

router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide', 'guide'),
        tourController.getMonthlyPlan
    );

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getTourWithin);

router.route('/distances/:latlng/unit/:unit')
    .get(tourController.getDistances);

router
    .route('/top-5-cheap-tours')
    .get(tourController.aliasTopTours, tourController.getAllTour);

router
    .route('/')
    .get(tourController.getAllTour)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'), tourController.createTour
    );

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour
    );

// router
//     .route('/:tourId/reviews')
//     .post(
//         authController.protect,
//         authController.restrictTo('user'),
//         reviewController.createReview
//     );


module.exports = router;