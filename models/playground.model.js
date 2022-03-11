const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.model');
const User = require('./user.model');
const { playgroundTypesEN } = require('../utils/translation');
const { playgroundLabels, playgroundEquipment } = require('../utils/labels');

// PLAYGROUND MODEL

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

// EVENT MODEL
const eventSchema = new Schema({
    playground_id: {
        type: Schema.Types.ObjectId,
        ref: 'Playground',
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    link: {
        type: String,
    },
    author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
});

// Delete all references to event.
eventSchema.post('findOneAndDelete', async function (event) {
    if (event) {
        await Playground.findByIdAndUpdate(event.playground_id, {
            $pull: { events: event._id },
        });
        await User.findByIdAndUpdate(event.author.id, {
            $pull: { events: event._id },
        });
    }
});

const Event = mongoose.model('Event', eventSchema);

// LOST & FOUND MODEL

const lostFoundSchema = new Schema({
    playground_id: {
        type: Schema.Types.ObjectId,
        ref: 'Playground',
        required: true,
    },
    status: {
        type: String,
        enum: ['lost', 'found'],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
});

lostFoundSchema.post('findOneAndDelete', async function (lostFound) {
    if (lostFound) {
        await User.findByIdAndUpdate(lostFound.author.id, {
            $pull: { lost_found: lostFound._id },
        });
        await Playground.findByIdAndUpdate(lostFound.playground_id, {
            $pull: { lost_found: lostFound._id },
        });
    }
});

const LostFound = mongoose.model('LostFound', lostFoundSchema);

module.exports = { Playground, Event, LostFound };
