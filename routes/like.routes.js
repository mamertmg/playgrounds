const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/review.controller');
const { ensureAuthenticated } = require('../middlewares/authorization');
const { isReviewAuthor } = require('../middlewares/isAuthor');
const asyncWrapper = require('../utils/asyncWrapper');

router.get(
    '/:reviewId/addLike',
    ensureAuthenticated,
    asyncWrapper(reviews.addLike)
);

router.get(
    '/:reviewId/rmvLike',
    ensureAuthenticated,
    asyncWrapper(reviews.rmvLike)
);

module.exports = router;