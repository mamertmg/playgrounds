const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/review.controller');
const { ensureAuthenticated } = require('../middlewares/authorization');
const { isAuthor } = require('../middlewares/isAuthor');
const asyncWrapper = require('../utils/asyncWrapper');

router.post('/', ensureAuthenticated, asyncWrapper(reviews.createReview));

router
    .route('/:reviewId')
    .delete(ensureAuthenticated, asyncWrapper(reviews.deleteReview))
    .put(ensureAuthenticated, asyncWrapper(reviews.updateReview));

module.exports = router;
