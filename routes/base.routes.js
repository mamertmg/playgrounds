const express = require('express');
const Playground = require('../models/playground.model');

const router = express.Router();

router.get('/', function (req, res) {
    // Collect all labels from DB for rendering landing page
    Playground.distinct('type', function (err, types) {
        if (err) {
            // TODO: redo error handling?
            res.status(500).render('shared/500');
        } else {
            res.render('base/landingpage', { labels: types });
        }
    });
});

router.get('/401', function (req, res) {
    res.status(401).render('shared/401');
});

router.get('/403', function (req, res) {
    res.status(403).render('shared/403');
});

module.exports = router;
