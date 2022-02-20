const express = require('express');
const router = express.Router();
const asyncWrapper = require('../utils/asyncWrapper');
const auth = require('../middlewares/authorization');
const {
    validatePlayground,
    validateEvent,
    validateEventDate,
} = require('../middlewares/validation');
const playgroundController = require('../controllers/playground.controller');
const Playground = require('../models/playground.model');
const Event = require('../models/event.model');

router
    .route('/')
    .get(
        asyncWrapper(async (req, res) => {
            const playgrounds = await Playground.find({});
            res.render('base/playgrounds', { playgrounds });
        })
    )
    .post(asyncWrapper(playgroundController.createPlayground));

router.get('/new', playgroundController.renderNewFrom);

router
    .route('/:id')
    .get(asyncWrapper(playgroundController.showPlayground))
    .put(
        validatePlayground,
        asyncWrapper(playgroundController.updatePlayground)
    )
    .delete(asyncWrapper(playgroundController.deletePlayground));

router.get('/:id/edit', asyncWrapper(playgroundController.renderEditForm));

router.post(
    '/:id/event',
    validateEvent,
    validateEventDate,
    asyncWrapper(async (req, res) => {
        const { id } = req.params;
        const playground = await Playground.findById(id);
        if (!playground) {
            req.flash('failure', 'Could not find playground.');
            return res.redirect('/');
        }
        const event = new Event({
            name: req.body.event.name,
            date: new Date(req.body.event.date + 'T' + req.body.event.time),
            info_link: req.body.event.info_link,
            playground_id: id,
        });
        playground.events.push(event);
        await event.save();
        await playground.save();
        res.redirect(`/playgrounds/${id}`);
    })
);

router.delete(
    '/:id/event/:eventId',
    asyncWrapper(async (req, res) => {
        const { id, eventId } = req.params;
        await Playground.findByIdAndUpdate(id, {
            $pull: { events: eventId },
        });
        await Event.findByIdAndDelete(eventId);
        req.flash('success', 'Successfully deleted event!');
        res.redirect(`/playgrounds/${id}`);
    })
);

module.exports = router;
