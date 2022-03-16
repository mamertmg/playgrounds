const Playground = require('../models/playground.model');
const Event = require('../models/event.model');
const LostFound = require('../models/lostfound.model');

module.exports = {
    isPlaygroundAuthor: async (req, res, next) => {
        const { id } = req.params;
        const playground = await Playground.findById(id);
        if (!playground.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/playgrounds/${id}`);
        }
        next();
    },
    isEventAuthor: async (req, res, next) => {
        const { id, eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event.author.id.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/playgrounds/${event.playground_id}`);
        }
        next();
    },
    isLostFoundAuthor: async (req, res, next) => {
        const { lfId } = req.params;
        const lostFound = await LostFound.findById(lfId);
        if (!lostFound.author.id.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/playgrounds/${lostFound.playground_id}`);
        }
        next();
    },
};

