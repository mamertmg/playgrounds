const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = require('./event.model');
const LostFound = require('./lostfound.model');
const Review = require('./review.model');
const { playgroundTypesEN } = require('../utils/translation');
const { playgroundLabels, playgroundEquipment } = require('../utils/labels');

const playgroundSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    address: String,
    suburb: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: playgroundTypesEN,
        require: true,
    },
    min_age: {
        type: Number,
        required: true,
    },
    max_age: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
    // store location as a GEOJSON object
    // https://docs.mongodb.com/manual/geospatial-queries/#geospatial-data
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    lost_found: [
        {
            type: Schema.Types.ObjectId,
            ref: 'LostFound',
        },
    ],
    rating: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Rating',
        },
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    labels: [
        {
            type: String,
            enum: [...playgroundLabels, ...playgroundEquipment],
        },
    ],
});

playgroundSchema.index({ location: '2dsphere' });

playgroundSchema.statics.findByLocation = function (
    [lat, lng, dist, limit],
    cb
) {
    return this.find({
        location: {
            $near: {
                $geometry: { type: 'Point', coordinates: [lng, lat] },
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
                $geometry: { type: 'Point', coordinates: [lng, lat] },
                $minDistance: 0,
                $maxDistance: dist,
            },
        },
        type: label,
    })
        .limit(limit)
        .exec(cb);
};

// Delete associated lists of documents if a playground is deleted.
playgroundSchema.post('findOneAndDelete', async function (playground) {
    if (playground) {
        await Event.deleteMany({ _id: { $in: playground.events } });
        await LostFound.deleteMany({ _id: { $in: playground.lost_found } });
        await Review.deleteMany({ _id: { $in: playground.reviews } });
    }
});

const Playground = mongoose.model('Playground', playgroundSchema);

module.exports = Playground;
