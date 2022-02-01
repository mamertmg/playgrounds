const mongoose = require("mongoose");
const axios = require("axios");
const Playground = require("../../models/playground.model");

mongoose.connect("mongodb://127.0.0.1:27017/playgrounds");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

// Fetch playground data and seed database.
axios
    .get(
        "https://opendata.duesseldorf.de/sites/default/files/Spielpl%C3%A4tze%20mit%20Notfallnummern%20WGS84.geojson"
    )
    .then((res) => {
        const response = res.data.features;
        const data = [];
        for (let i = 0; i < response.length; i++) {
            const { nr } = response[i].properties;
            // for valid data, nr is a Number, null otherwise
            if (!nr && nr !== 0) {
                continue;
            }

            const {
                objektschluessel,
                objektbezeichnung,
                strasse_hausnr,
                objektart,
            } = response[i].properties;

            const typeSplit = objektart.split(" ");
            if (typeSplit.length === 2) {
                objektart = typeSplit[1];
            }

            const location = response[i].geometry;
            const playground = {
                key: objektschluessel,
                name: objektbezeichnung,
                address: strasse_hausnr,
                type: objektart,
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
