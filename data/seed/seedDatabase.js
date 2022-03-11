const mongoose = require('mongoose');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const Playground = require('../../models/playground.model');
const User = require('../../models/user.model');

const { playgroundTypesEN } = require('../../utils/translation');
const { playgroundLabels, playgroundEquipment } = require('../../utils/labels');

mongoose.connect('mongodb://127.0.0.1:27017/playgrounds');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
});

const descriptionTxt = [
    'A wonderful playground in the city.',
    'There are a lot of trees.',
    'This is a lovely playground. It is easy to get to by public transport and it is suitable for smaller children as well as for young teens.',
];

const genAge = function (minAge = -1) {
    while (true) {
        let n = Math.floor(Math.random() * 17);
        if (n > minAge) {
            return n;
        }
    }
};

function sampleDistinctNumbers(max, numSamples = 3) {
    const result = [];
    while (result.length < numSamples) {
        const n = Math.floor(Math.random() * max);
        if (!result.includes(n)) {
            result.push(n);
        }
    }
    return result;
}

// Find user 'admin' or create them if they do not exist. Author of all default playgrounds.
User.findOne({ name: 'admin' }, async (error, user) => {
    if (error) {
        throw error;
    } else {
        if (!user) {
            user = new User({
                name: 'admin',
                email: 'admin@playgroundduess.de',
                password: 'pass123',
            });

            // Hash password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, async (err, hash) => {
                    if (err) throw err;
                    // Set password to hashed
                    user.password = hash;
                    // Save user
                    await user.save();
                });
            });
        }

        //Fetch playground data and seed database
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

                    const location = response[i].geometry;
                    const lat = location.coordinates[1];
                    const lng = location.coordinates[0];

                    const labels = [];
                    for (let i of sampleDistinctNumbers(
                        playgroundLabels.length
                    )) {
                        labels.push(playgroundLabels[i]);
                    }
                    for (let i of sampleDistinctNumbers(
                        playgroundEquipment.length
                    )) {
                        labels.push(playgroundEquipment[i]);
                    }

                    // get suburb from coordinates
                    await axios
                        .get(
                            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&limit=1`
                        )
                        .then((response) => {
                            const suburb =
                                objektbezeichnung ===
                                'BUEDERICHER STR., Bolzpl.'
                                    ? 'Lörick'
                                    : response.data.address.suburb;
                            const playground = {
                                name: objektbezeichnung,
                                address: strasse_hausnr
                                    ? strasse_hausnr
                                    : `${response.data.address.road} ${response.data.address.house_number}`,
                                suburb,
                                city: 'Düsseldorf',
                                type: playgroundTypesEN[objektart],
                                min_age,
                                max_age,
                                description,
                                location,
                                labels,
                                author: user,
                            };
                            data.push(playground);
                            console.log(data.length, suburb);
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
    }
});
