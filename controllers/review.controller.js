const Playground = require('../models/playground.model');
const Review = require('../models/review.model');

module.exports.createReview = async (req, res) => {
    const playground = await Playground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    playground.reviews.push(review);
    await review.save();
    await playground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/playgrounds/${playground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Playground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/playgrounds/${id}`);
}

module.exports.updateReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findByIdAndUpdate(reviewId, {
        ...req.body,
    });
    req.flash('success', 'Updated review!');
    res.redirect(`/playgrounds/${id}/reviews/${review._id}`);
}
