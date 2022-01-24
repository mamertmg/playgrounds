const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require("method-override");
const mongoose = require('mongoose');

const Playground = require('./models/playground');

const port = 3000;
const defaultLimit = 10;
const defaultDistance = 5000;

// possible labels
let labels = [];

mongoose.connect('mongodb://localhost:27017/playgroundsWeb')
    .then(() => {
        console.log("MongoDB connection open...");
        // Collect all labels from DB
        Playground.distinct('type', function(err, types) {
            if(err) { console.log(err); }
            labels = types;
            console.log(labels);
        });
    })
    .catch(err => {
        console.log("Could not connect to database.");
        console.log(err);
    });

// ExpressJS setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));

// serving landing page
app.get('/', async (req, res) => {
    res.render('map-styling/index', { labels });
});

// rudementary details page
app.get('/playgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findById(id);
    res.render('details', { playground });
});

// TODO: finish setup for editing, deleting and adding playgrounds
// app.get('/playgrounds/:id/edit', async (req, res) => {
//     const { id } = req.params;
//     const playground = await Playground.findById(id);
//     res.render('edit', { playground, labels });
// });

// Handle queries to DB from client
app.get('/api/playgrounds', async (req, res) => {
    // return all playgrounds if no query params
    if(Object.keys(req.query).length === 0) {
        const playgrounds = await Playground.find({});
        const data = JSON.stringify(playgrounds);
        res.send(data);
    }

    // TODO: finish validation of query params
    let { lat, lng, label, limit, dist } = req.query;
    limit = Number(limit) ? Number(limit) : defaultLimit;
    dist = Number(dist) ? Number(dist) : defaultDistance;
    if(lat && lng && !label) {
        // CASE 1: only location
        lat = Number(lat);
        lng = Number(lng);
        // find the [limit] closest playgrounds
        Playground.findByLocation([lat, lng, dist, limit], function(err, playgrounds) {
            //console.log("find by loc");
            if(err) { 
                console.log(err);
            } else {
                //console.log(playgrounds);
                const data = JSON.stringify(playgrounds);
                res.send(data);
            }
        });
    } else if(lat && lng && label) {
        // CASE 2: location + label
        lat = Number(lat);
        lng = Number(lng);
        Playground.findByLocAndLabel([lat, lng, label, dist, limit], function(err, playgrounds) {
            if(err) { 
                console.log(err);
            } else {
                //console.log(playgrounds);
                const data = JSON.stringify(playgrounds);
                res.send(data);
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});

