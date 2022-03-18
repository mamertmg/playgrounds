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
const { ensureAuthenticated } = require('../middlewares/authorization');
const User = require('../models/user.model');
const {
    isPlaygroundAuthor,
    isEventAuthor,
    isLostFoundAuthor,
} = require('../middlewares/isAuthor');
const multer = require('multer');

// Image storage on Cloudinary
const { storage } = require('../config/cloudinaryStorage');
const upload = multer({ storage });

router
    .route('/')
    .get(
        asyncWrapper(async (req, res) => {
            const playgrounds = await Playground.find({});
            res.render('base/playgrounds', { playgrounds });
        })
    )
    .post(
        ensureAuthenticated,
        asyncWrapper(playgroundController.createPlayground)
    );

router.get('/new', ensureAuthenticated, playgroundController.renderNewFrom);

router
    .route('/:id')
    .get(asyncWrapper(playgroundController.showPlayground))
    .put(
        ensureAuthenticated,
        isPlaygroundAuthor,
        validatePlayground,
        asyncWrapper(playgroundController.updatePlayground)
    )
    .delete(
        ensureAuthenticated,
        isPlaygroundAuthor,
        asyncWrapper(playgroundController.deletePlayground)
    );

router.get(
    '/:id/edit',
    ensureAuthenticated,
    isPlaygroundAuthor,
    asyncWrapper(playgroundController.renderEditForm)
);

// Event routes
router.post(
    '/:id/event',
    ensureAuthenticated,
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
            author: {
                id: req.user._id,
                name: req.user.name,
            },
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
        ensureAuthenticated,
        isEventAuthor,
        asyncWrapper(async (req, res, next) => {
            const { id, eventId } = req.params;
            const event = await Event.findById(eventId);
            console.log(event.playground_id);
            if (!event || event.playground_id.toString() !== id) {
                req.flash('failure', 'Could not delete event.');
                return res.redirect('/');
            }
            await Playground.findByIdAndUpdate(event.playground_id, {
                $pull: { events: event._id },
            });
            await event.remove();
            req.flash('success', 'Successfully deleted event!');
            res.redirect(`/playgrounds/${id}`);
        })
    )
    .put(
        ensureAuthenticated,
        isEventAuthor,
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
    ensureAuthenticated,
    validateLostFound,
    asyncWrapper(async (req, res) => {
        const { id } = req.params;
        const playground = await Playground.findById(id);
        if (!playground) {
            req.flash('failure', 'Could not find playground.');
            return res.redirect('/');
        }
        const lostFound = new LostFound({
            title: req.body.lost_found.title,
            status: req.body.lost_found.status,
            date: new Date(req.body.lost_found.date),
            playground_id: id,
            description: req.body.lost_found.description,
            contact: req.body.lost_found.contact,
            author: { id: req.user._id, name: req.user.name },
        });

        playground.lost_found.push(lostFound);
        await lostFound.save();
        await playground.save();
        res.redirect(`/playgrounds/${id}`);
    })
);

router
    .route('/:id/lost-found/:lfId')
    .delete(
        ensureAuthenticated,
        isLostFoundAuthor,
        asyncWrapper(async (req, res) => {
            const { id, lfId } = req.params;
            const lostFound = await LostFound.findById(lfId);
            if (!lostFound || lostFound.playground_id.toString() !== id) {
                req.flash('failure', 'Could not delete Lost&Found entry.');
                return res.redirect('/');
            }
            await Playground.findByIdAndUpdate(lostFound.playground_id, {
                $pull: { lost_found: lostFound._id },
            });
            await lostFound.remove();
            req.flash('success', 'Successfully deleted Lost&Found entry!');
            res.redirect(`/playgrounds/${id}`);
        })
    )
    .put(
        ensureAuthenticated,
        isLostFoundAuthor,
        validateLostFound,
        asyncWrapper(async (req, res) => {
            const { id, lfId } = req.params;
            const updatedLostFound = {
                title: req.body.lost_found.title,
                status: req.body.lost_found.status,
                date: new Date(req.body.lost_found.date),
                description: req.body.lost_found.description,
                contact: req.body.lost_found.contact,
            };

            await LostFound.findByIdAndUpdate(lfId, updatedLostFound);
            req.flash('success', 'Successfully updated Lost&Found entry!');
            res.redirect(`/playgrounds/${id}`);
        })
    );

// Save new playground image
router.post(
    '/:id/image/new',
    ensureAuthenticated,
    upload.single('playgroundPhoto'),
    asyncWrapper(async (req, res) => {
        const { id } = req.params;
        const playground = await Playground.findById(id);
        if (!playground) {
            req.flash('failure', 'Could not find playground.');
            return res.redirect('/');
        }
        
        const img = { url: req.file.path, filename: req.file.filename };
        if (req.body.description) {
            img.description = req.body.description;
        }
        playground.images.push(img);
        await playground.save();
        res.redirect(`/playgrounds/${playground._id}`);
    })
);

module.exports = router;
