const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = require('./event.model');
const LostFound = require('./lostfound.model');
const Review = require("./review.model")


const playgroundSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    address: String,
    type: {
        type: String,
        require: true,
        default: 'Kinderspielplatz',
    },
    age_group: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    equipment: {
        type: String,
        default: '',
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
    rating:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Rating'
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
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
