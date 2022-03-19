const Playground = require('../models/playground.model');
const Event = require('../models/event.model');
const LostFound = require('../models/lostfound.model');
const Review = require('../models/review.model');

module.exports = {
    isPlaygroundAuthor: async (req, res, next) => {
        const { id } = req.params;
        const playground = await Playground.findById(id);
        if (!playground) {
            req.flash('failure', 'Could not find playground.');
            return res.redirect('/');
        }
        if (!playground.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/playgrounds/${id}`);
        }
        next();
    },
    isEventAuthor: async (req, res, next) => {
        const { id, eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event || !event.author.id.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/playgrounds/${id}`);
        }
        next();
    },
    isLostFoundAuthor: async (req, res, next) => {
        const { id, lfId } = req.params;
        const lostFound = await LostFound.findById(lfId);
        if (!lostFound || !lostFound.author.id.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/playgrounds/${id}`);
        }
        next();
    },
    isReviewAuthor: async (req, res, next) => {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review || !review.author.id.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/playgrounds/${id}`);
        }
        next();
    },
};
