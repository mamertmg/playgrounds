const express = require('express');
const Playground = require('../models/playground.model');
const Event = require('../models/event.model');
const LostFound = require('../models/lostfound.model');
const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');
const { isLatitude, isLongitude } = require('../utils/validation');

const router = express.Router();

const DEFAULT_LIMIT = 10;
const DEFAULT_DISTANCE = 2000;

// Handle queries to DB from client
router.get('/playgrounds', async (req, res, next) => {
    // return all playgrounds if no query params
    if (Object.keys(req.query).length === 0) {
        try {
            const playgrounds = await Playground.find({});
            const data = JSON.stringify(playgrounds);
            res.send(data);
        } catch (e) {
            return next(e);
        }
    } else {
        let { lat, lng, label, limit, dist } = req.query;

        // use default value if limit and distance not defined by request
        limit = Number(limit) ? Number(limit) : DEFAULT_LIMIT;
        dist = Number(dist) ? Number(dist) * 1000 : DEFAULT_DISTANCE;

        if (isLatitude(lat) && isLongitude(lng)) {
            if (!label) {
                // CASE 1: only location
                lat = Number(lat);
                lng = Number(lng);
                // find the [limit] closest playgrounds
                Playground.findByLocation(
                    [lat, lng, dist, limit],
                    function (err, playgrounds) {
                        if (err) {
                            console.log(err);
                            next(err);
                        } else {
                            const data = JSON.stringify(playgrounds);
                            res.send(data);
                        }
                    }
                );
            } else {
                // CASE 2: location + label
                lat = Number(lat);
                lng = Number(lng);
                Playground.findByLocAndLabel(
                    [lat, lng, label, dist, limit],
                    function (err, playgrounds) {
                        if (err) {
                            console.log(err);
                            next(err);
                        } else {
                            const data = JSON.stringify(playgrounds);
                            res.send(data);
                        }
                    }
                );
            }
        } else {
            res.status(400).send('Invalid coordinates in query');
        }
    }
});

router.get(
    '/events',
    asyncWrapper(async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.status(400).send('Invalid event ID');
        }
        const event = await Event.findById(id);
        res.send(event);
    })
);

router.get(
    '/lost-found',
    asyncWrapper(async (req, res) => {
        const { id } = req.query;
        if (!id) {
            return res.status(400).send('Invalid lost and found ID');
        }
        const post = await LostFound.findById(id);
        res.send(post);
    })
);

module.exports = router;
