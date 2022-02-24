const express = require('express');
const router = express.Router();
const asyncWrapper = require('../utils/asyncWrapper');
const {
    validatePlayground,
    validateEvent,
    validateEventDate,
    validateLostFound,
} = require('../middlewares/validation');
const playgroundController = require('../controllers/playground.controller');
const Playground = require('../models/playground.model');
const Event = require('../models/event.model');
const LostFound = require('../models/lostfound.model');

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

// Event routes
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
            title: req.body.event.title,
            status: 1,
            date: new Date(req.body.event.date + 'T' + req.body.event.time),
            playground_id: id,
        });

        // optional fields
        if (req.body.event.description) {
            event.description = req.body.event.description;
        }
        if (req.body.event.image) {
            event.image = req.body.event.image;
        }
        if (req.body.event.link) {
            event.link = req.body.event.link;
        }

        playground.events.push(event);
        await event.save();
        await playground.save();
        res.redirect(`/playgrounds/${id}`);
    })
);

router
    .route('/:id/event/:eventId')
    .delete(
        asyncWrapper(async (req, res) => {
            const { id, eventId } = req.params;
            await Playground.findByIdAndUpdate(id, {
                $pull: { events: eventId },
            });
            await Event.findByIdAndDelete(eventId);
            req.flash('success', 'Successfully deleted event!');
            res.redirect(`/playgrounds/${id}`);
        })
    )
    .put(
        validateEvent,
        validateEventDate,
        asyncWrapper(async (req, res) => {
            const { id, eventId } = req.params;
            let updatedEvent = {
                title: req.body.event.title,
                status: 1,
                date: new Date(req.body.event.date + 'T' + req.body.event.time),
                playground_id: id,
            };

            // optional fields
            if (req.body.event.description) {
                updatedEvent.description = req.body.event.description;
            } else {
                updatedEvent.description = '';
            }
            if (req.body.event.image) {
                updatedEvent.image = req.body.event.image;
            } else {
                updatedEvent.image = '';
            }
            if (req.body.event.link) {
                updatedEvent.link = req.body.event.link;
            } else {
                updatedEvent.link = '';
            }
            await Event.findByIdAndUpdate(eventId, updatedEvent);
            res.redirect(`/playgrounds/${id}?eventId=${eventId}`);
        })
    );

// Lost&Found routes
router.post(
    '/:id/lost-found',
    validateLostFound,
    asyncWrapper(async (req, res) => {
        const { id } = req.params;
        const playground = await Playground.findById(id);
        if (!playground) {
            req.flash('failure', 'Could not find playground.');
            return res.redirect('/');
        }
        const lostFound = new LostFound({
            title: req.body.lostFound.title,
            status: 1,
            date: new Date(req.body.lostFound.date),
            playground_id: id,
            description: req.body.lostFound.description,
            contact: req.body.lostFound.contact,
        });

        playground.lost_found.push(lostFound);
        await lostFound.save();
        await playground.save();
        res.redirect(`/playgrounds/${id}`);
    })
);

router.delete(
    '/:id/lost-found/:lfId',
    asyncWrapper(async (req, res) => {
        const { id, lfId } = req.params;
        await Playground.findByIdAndUpdate(id, {
            $pull: { lost_found: lfId },
        });
        await LostFound.findByIdAndDelete(lfId);
        req.flash('success', 'Successfully deleted event!');
        res.redirect(`/playgrounds/${id}`);
    })
);

module.exports = router;
