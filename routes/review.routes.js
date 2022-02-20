const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/review.controller');
const {ensureAuthenticated} = require('../middlewares/authorization');
const {isAuthor} = require('../middlewares/isAuthor');
const asyncWrapper = require('../utils/asyncWrapper')

router.get('/',ensureAuthenticated, asyncWrapper(reviews.getAllReviews))

router.post('/', ensureAuthenticated, isAuthor, asyncWrapper(reviews.createReview))

router.delete('/:reviewId', ensureAuthenticated, isAuthor, asyncWrapper(reviews.deleteReview))

module.exports = router;