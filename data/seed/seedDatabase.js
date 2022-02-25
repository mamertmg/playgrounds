const mongoose = require('mongoose');
const axios = require('axios');
const Playground = require('../../models/playground.model');

mongoose.connect('mongodb://127.0.0.1:27017/playgrounds');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});

const genAge = function (minAge = -1) {
    while (true) {
        let n = Math.floor(Math.random() * 17);
        if (n > minAge) {
            return n;
        }
    }
};
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
    .then(async (res) => {
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
            const min_age = genAge();
            const max_age = min_age === 16 ? 100 : genAge(min_age);
            const description =
                descriptionTxt[
                    Math.floor(Math.random() * descriptionTxt.length)
                ];
            const equipment =
                equipmentTxt[Math.floor(Math.random() * equipmentTxt.length)];

            const location = response[i].geometry;
            const lat = location.coordinates[1];
            const lng = location.coordinates[0];

            // get suburb from coordinates
            await axios
                .get(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&limit=1`
                )
                .then((response) => {
                    const suburb =
                        objektbezeichnung === 'BUEDERICHER STR., Bolzpl.'
                            ? 'Lörick'
                            : response.data.address.suburb;
                    const playground = {
                        name: objektbezeichnung,
                        address: strasse_hausnr,
                        suburb,
                        type: objektart,
                        min_age,
                        max_age,
                        description,
                        equipment,
                        location,
                    };
                    data.push(playground);
                    console.log(data.length, suburb, min_age, max_age);
                })
                .catch((err) => console.log(err));
        }

        Playground.insertMany(data)
            .then(() => db.close())
            .catch((e) => {
                console.log(e);
            });
    })
    .catch((err) => console.log(err));
