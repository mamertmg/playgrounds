const mongoose = require('mongoose');
const axios = require('axios');
const Playground = require('../../models/playground.model');

mongoose.connect('mongodb://127.0.0.1:27017/playgrounds');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});

const ageGroupTxt = ['0-16+', '0-12', '10-14'];
const descriptionTxt = [
    'Fenced, in a park, benches, shaded, nearby parking possible',
    'Forest area, shaded, nearby parking possible',
    'Urban area, no free parking nearby',
];
const equipmentTxt = [
    'Ropeway, table tennis table, football goals, climbing frame with slide, sand play area',
    'Climbing frame with slide, sand play area',
    'Ropeway, table tennis table, sand play area',
    'Football goals, table tennis table',
];

// Fetch playground data and seed database.
axios
    .get(
        'https://opendata.duesseldorf.de/sites/default/files/Spielpl%C3%A4tze%20mit%20Notfallnummern%20WGS84.geojson'
    )
    .then((res) => {
        const response = res.data.features;
        const data = [];
        for (let i = 0; i < response.length; i++) {
            const { nr } = response[i].properties;
            // skip empty rows where nr has the value null (the value is a number otherwise)
            if (!nr && nr !== 0) {
                continue;
            }

            const { objektbezeichnung, strasse_hausnr } =
                response[i].properties;

            // most 'objektart' values have the format "336 Kinderspielplatz"
            let { objektart } = response[i].properties;
            const typeSplit = objektart.split(' ');
            if (typeSplit.length > 1) {
                objektart = typeSplit[1];
            }
            const age_group =
                ageGroupTxt[Math.floor(Math.random() * ageGroupTxt.length)];
            const description =
                descriptionTxt[
                    Math.floor(Math.random() * descriptionTxt.length)
                ];
            const equipment =
                equipmentTxt[Math.floor(Math.random() * equipmentTxt.length)];

            const location = response[i].geometry;
            const playground = {
                name: objektbezeichnung,
                address: strasse_hausnr,
                type: objektart,
                age_group,
                description,
                equipment,
                location,
            };
            data.push(playground);
        }

        Playground.insertMany(data)
            .then(() => db.close())
            .catch((e) => {
                console.log(e);
            });
    })
    .catch((err) => console.log(err));
