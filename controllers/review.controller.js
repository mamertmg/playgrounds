const Playground = require('../models/playground.model');
const Review = require('../models/review.model');

module.exports.createReview = async (req, res) => {
    console.log(req.body.review);
    const playground = await Playground.findById(req.params.id);
    const review = new Review({
        rating: Number(req.body.review.rating),
        body: req.body.review.body,
        author: {
            id: req.user._id,
            name: req.user.name,
        },
    });
    playground.reviews.push(review);
    await review.save();
    await playground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/playgrounds/${playground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Playground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/playgrounds/${id}`);
};

module.exports.updateReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findByIdAndUpdate(reviewId, {
        rating: Number(req.body.review.rating),
        body: req.body.review.body,
    });
    req.flash('success', 'Updated review!');
    res.redirect(`/playgrounds/${id}`);
};

module.exports.addLike = async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(400).send('Invalid reviewId');
    }
    review.likes.push(req.user._id);
    await review.save();
    const numLikes = review.likes.length;
    res.json({ numLikes });
};

module.exports.rmvLike = async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(400).send('Invalid reviewId');
    }
    review.likes.pull(req.user._id);
    await review.save();
    const numLikes = review.likes.length;
    res.json({ numLikes });
};
