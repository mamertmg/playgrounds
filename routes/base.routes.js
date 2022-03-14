const express = require('express');
const Playground = require('../models/playground.model');
const asyncWrapper = require('../utils/asyncWrapper');
const { playgroundLabels, playgroundEquipment } = require('../utils/labels');

const router = express.Router();

router.get('/', function (req, res) {
    res.render('base/landingPage');
});

router.get(
    '/search',
    asyncWrapper(async (req, res) => {
        if (Object.keys(req.query).length === 0) {
            res.redirect('/');
        }
        const { q, lat, lng, dist } = req.query;
        // Valid call to search route must have the following params:
        // q and dist OR lat, lng and dist
        if ((!lat && lng) || (lat && !lng) || !((q || lat && lng) && dist)) {
            res.redirect('/');
        }
        // Collect all labels from DB for rendering landing page
        Playground.distinct('type', function (err, types) {
            if (err) {
                res.status(500).render('shared/500');
            } else {
                res.render('base/searchResultPage', {
                    q: q ? q : '',
                    dist: dist ? dist : '1',
                    types,
                    playgroundLabels,
                    playgroundEquipment,
                });
            }
        });
    })
);

router.get('/401', function (req, res) {
    res.status(401).render('shared/401');
});

router.get('/403', function (req, res) {
    res.status(403).render('shared/403');
});

module.exports = router;
