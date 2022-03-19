const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/review.controller');
const { ensureAuthenticated } = require('../middlewares/authorization');
const { isReviewAuthor } = require('../middlewares/isAuthor');
const asyncWrapper = require('../utils/asyncWrapper');

router.post('/', ensureAuthenticated, asyncWrapper(reviews.createReview));

router
    .route('/:reviewId')
    .delete(
        ensureAuthenticated,
        isReviewAuthor,
        asyncWrapper(reviews.deleteReview)
    )
    .put(
        ensureAuthenticated,
        isReviewAuthor,
        asyncWrapper(reviews.updateReview)
    );

module.exports = router;
