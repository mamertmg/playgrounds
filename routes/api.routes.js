const express = require('express');
const Playground = require('../models/playground.model');
const Event = require('../models/event.model');
const LostFound = require('../models/lostfound.model');
const AppError = require('../utils/AppError');
const asyncWrapper = require('../utils/asyncWrapper');
const { isLatitude, isLongitude } = require('../utils/validation');

const router = express.Router();

const DEFAULT_LIMIT = 20;
const DEFAULT_DISTANCE = 2000;

function isValidAge(age) {
    let numAge = Number(age);
    // always return false if numAge NaN
    if (!numAge && numAge !== 0) {
        return false;
    }
    return numAge >= 0 && numAge <= 16;
}

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
        let { lat, lng, type, limit, dist, labels, age } = req.query;

        // use default value if limit and distance not defined by request
        limit = Number(limit) ? Number(limit) : DEFAULT_LIMIT;
        dist = Number(dist) ? Number(dist) * 1000 : DEFAULT_DISTANCE;

        // valid type and labels values are comma separated keywords
        if (type) {
            type = type.split(',');
        }

        if (labels) {
            labels = labels.split(',');
        }

        // param age is a list of age ranges, if valid
        let minAge = 0;
        let maxAge = 0; // maxAge = 0 is treated as no upper limit on age in DB query
        if (age) {
            age = age.split('-');
            if (age.length !== 2) {
                return res.status(400).send('Invalid age range');
            }
            if (isValidAge(age[0])) {
                minAge = Number(age[0]);
            } else {
                return res.status(400).send('Invalid age range');
            }
            if (age[1] !== 'any' && isValidAge(age[1])) {
                if (Number(age[1]) >= minAge) {
                    maxAge = Number(age[1]);
                } else {
                    return res.status(400).send('Invalid age range');
                }
            }
        }

        if (isLatitude(lat) && isLongitude(lng)) {
            // CASE 1: valid location coordinates
            lat = Number(lat);
            lng = Number(lng);
            // find the [limit] closest playgrounds
            Playground.findByInputWithLoc(
                [lat, lng, dist, type, minAge, maxAge, labels, limit],
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
            // CASE 2: no location
            Playground.findByInput(
                [type, minAge, maxAge, labels, limit],
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
