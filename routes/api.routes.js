const express = require("express");
const Playground = require("../models/playground.model");
const { isLatitude, isLongitude } = require("../middlewares/apiValidators");

const router = express.Router();

const defaultLimit = 10;
const defaultDistance = 5000;

// Handle queries to DB from client
router.get("/playgrounds", async (req, res, next) => {
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
        limit = Number(limit) ? Number(limit) : defaultLimit;
        dist = Number(dist) ? Number(dist) : defaultDistance;

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
            res.status(400).send("Invalid coordinates in query");
        }
    }
});

module.exports = router;
