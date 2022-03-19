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
            return res.redirect('/');
        }
        const { q, lat, lng, dist, labels, type } = req.query;
        // Valid call to search route must have at least the following params:
        // 1.) if there is only 1 param, it must be labels or type with ONE valid label
        if (Object.keys(req.query).length === 1 && (!labels && !type)) {
            return res.redirect('/');
        } else if (Object.keys(req.query).length === 1 && labels) {
            if (
                !playgroundLabels.includes(labels) &&
                !playgroundEquipment.includes(labels)
            ) {
                return res.redirect('/');
            }
        } else if (Object.keys(req.query).length === 1 && type) {
            Playground.distinct('type', function (err, types) {
                if (err) {
                    res.status(500).render('shared/500');
                } else {
                    // redirect to landing page if invalid type
                    if (!types.includes(type)) {
                        return res.redirect('/');
                    }
                    res.render('base/searchResultPage', {
                        q: q ? q : '',
                        dist: dist ? dist : '5',
                        types,
                        playgroundLabels,
                        playgroundEquipment,
                        label: labels,
                        type: type
                    });
                }
            });
        }
        // 2.) Otherwise: at least q and dist OR lat, lng and dist
        else if (
            (!lat && lng) ||
            (lat && !lng) ||
            !((q || (lat && lng)) && dist)
        ) {
            return res.redirect('/');
        }
        // Collect all labels from DB for rendering landing page
        Playground.distinct('type', function (err, types) {
            if (err) {
                res.status(500).render('shared/500');
            } else {
                res.render('base/searchResultPage', {
                    q: q ? q : '',
                    dist: dist ? dist : '5',
                    types,
                    playgroundLabels,
                    playgroundEquipment,
                    label: labels,
                    type: type
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
