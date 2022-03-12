const express = require('express');
const { Playground } = require('../models/playground.model');
const asyncWrapper = require('../utils/asyncWrapper');

const router = express.Router();

router.get('/', function (req, res) {
    res.render('base/landingPage');
    // Collect all labels from DB for rendering landing page
    // Playground.distinct('type', function (err, types) {
    //     if (err) {
    //         res.status(500).render('shared/500');
    //     } else {
    //         res.render('base/landingPage', {
    //             types,
    //         });
    //     }
    // });
});

router.get(
    '/search',
    asyncWrapper(async (req, res) => {
        const { q, lat, lng, dist } = req.query;
        if (q && lat && lng && dist) {
            await Playground.findByLocation(
                [Number(lat), Number(lng), Number(dist) * 1000, 100],
                function (err, playgrounds) {
                    if (err) {
                        console.log(err);
                        return next(err);
                    } else {
                        return res.render('base/searchResultPage', {
                            playgrounds,
                            q,
                            dist,
                        });
                    }
                }
            );
        } else {
            res.render('base/searchResultPage', {
                q: 'Düsseldorf',
                dist: 0,
                playgrounds: [],
            });
        }
    })
);

router.get('/401', function (req, res) {
    res.status(401).render('shared/401');
});

router.get('/403', function (req, res) {
    res.status(403).render('shared/403');
});

module.exports = router;
