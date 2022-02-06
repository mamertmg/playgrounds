const mongoose = require("mongoose");

var playgroundSchema = mongoose.Schema({
    key: {
        type: String,
        require: true,
        default: "",
    },
    name: {
        type: String,
        require: true,
    },
    address: String,
    type: {
        type: String,
        require: true,
        default: "Kinderspielplatz",
    },
    // store location as a GEOJSON object
    // https://docs.mongodb.com/manual/geospatial-queries/#geospatial-data
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

playgroundSchema.index({ location: "2dsphere" });

playgroundSchema.statics.findByLocation = function (
    [lat, lng, dist, limit],
    cb
) {
    return this.find({
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $minDistance: 0,
                $maxDistance: dist,
            },
        },
    })
        .limit(limit)
        .exec(cb);
};

playgroundSchema.statics.findByLocAndLabel = function (
    [lat, lng, label, dist, limit],
    cb
) {
    return this.find({
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [lng, lat] },
                $minDistance: 0,
                $maxDistance: dist,
            },
        },
        type: label,
    })
        .limit(limit)
        .exec(cb);
};

const Playground = mongoose.model("Playground", playgroundSchema);

module.exports = Playground;
