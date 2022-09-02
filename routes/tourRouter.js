const express = require('express')
const tourController = require('../controller/tourController') 

const router = express.Router()
// middleware for routes
// router.param('id', tourController.checkId)

router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)
router.route('/top-5-cheap').get(tourController.getTop5Middleware, tourController.getAllTours)

// router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.createNewTour)
router.route('/').get(tourController.getAllTours).post(tourController.createNewTour)
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour)
// router.route('/addAll/:token').post(tourController.addAllTours)
module.exports = router

