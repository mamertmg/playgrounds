const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = require('./event.model');
const LostFound = require('./lostfound.model');
const Review = require('./review.model');
const User = require('./user.model');
const { playgroundTypesEN } = require('../utils/translation');
const { playgroundLabels, playgroundEquipment } = require('../utils/labels'); // PLAYGROUND MODEL

const ImageSchema = new Schema({
    url: { type: String, required: true },
    filename: { type: String, required: true },
    description: String,
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

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
    images: [ImageSchema],
});

playgroundSchema.index({ location: '2dsphere' });

playgroundSchema.statics.findByInputWithLoc = function (
    [lat, lng, dist, type, minAge, maxAge, labels, limit],
    cb
) {
    // if both minAge and maxAge are 0, do not filter for age
    const useAgeFilter = minAge === 0 && maxAge === 0 ? false : true;
    if (!useAgeFilter) {
        return this.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lng, lat] },
                    $minDistance: 0,
                    $maxDistance: dist,
                },
            },
            type: type ? { $in: type } : { $exists: true },
            labels: labels ? { $all: labels } : { $exists: true },
        })
            .limit(limit)
            .exec(cb);
    }

    return this.find({
        $and: [
            {
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [lng, lat] },
                        $minDistance: 0,
                        $maxDistance: dist,
                    },
                },
            },
            { type: type ? { $in: type } : { $exists: true } },
            { labels: labels ? { $all: labels } : { $exists: true } },
            maxAge === 0
                ? // case 1: when no upper bound on age set: maxAge *always* 0
                  {
                      $and: [
                          { max_age: { $gte: minAge } },
                          {
                              $or: [
                                  { min_age: { $gte: minAge } },
                                  { min_age: { $lte: minAge } },
                              ],
                          },
                      ],
                  }
                : {
                      $or: [
                          // case 2: [minAge, maxAge] is exactly the age range of playground
                          // => min_age >= minAge && max_age <= maxAge
                          {
                              $and: [
                                  { min_age: { $gte: minAge } },
                                  { max_age: { $lte: maxAge } },
                              ],
                          },
                          // case 2: [minAge, maxAge] is subinterval of [min_age, max_age]
                          // => min_age < minAge && max_age > maxAge
                          {
                              $and: [
                                  { min_age: { $lt: minAge } },
                                  { max_age: { $gt: maxAge } },
                              ],
                          },
                          // case 4.1: Intervals [minAge, maxAge] and [min_age, max_age] overlap
                          // => min_age < minAge && max_age <= maxAge
                          {
                              $and: [
                                  { min_age: { $lt: minAge } },
                                  { maxAge: { $gte: minAge, $lte: maxAge } },
                              ],
                          },
                          // case 4.2: Intervals [minAge, maxAge] and [min_age, max_age] overlap
                          // => min_age >= minAge && max_age > maxAge
                          {
                              $and: [
                                  { min_age: { $gte: minAge, $lte: maxAge } },
                                  { maxAge: { $gt: maxAge } },
                              ],
                          },
                      ],
                  },
        ],
    })
        .limit(limit)
        .exec(cb);
};

playgroundSchema.statics.findByInput = function (
    [type, minAge, maxAge, labels, limit],
    cb
) {
    // if both minAge and maxAge are 0, do not filter for age
    const useAgeFilter = minAge === 0 && maxAge === 0 ? false : true;
    if (!useAgeFilter) {
        return this.find({
            type: type ? type : { $exists: true },
            labels: labels ? { $all: labels } : { $exists: true },
        })
            .limit(limit)
            .exec(cb);
    }

    return this.find({
        $and: [
            { type: type ? type : { $exists: true } },
            { labels: labels ? { $all: labels } : { $exists: true } },
            maxAge === 0
                ? // case 1: when no upper bound on age set: maxAge *always* 0
                  {
                      $and: [
                          { max_age: { $gte: minAge } },
                          {
                              $or: [
                                  { min_age: { $gte: minAge } },
                                  { min_age: { $lte: minAge } },
                              ],
                          },
                      ],
                  }
                : {
                      $or: [
                          // case 2: [minAge, maxAge] is exactly the age range of playground
                          // => min_age >= minAge && max_age <= maxAge
                          {
                              $and: [
                                  { min_age: { $gte: minAge } },
                                  { max_age: { $lte: maxAge } },
                              ],
                          },
                          // case 2: [minAge, maxAge] is subinterval of [min_age, max_age]
                          // => min_age < minAge && max_age > maxAge
                          {
                              $and: [
                                  { min_age: { $lt: minAge } },
                                  { max_age: { $gt: maxAge } },
                              ],
                          },
                          // case 4.1: Intervals [minAge, maxAge] and [min_age, max_age] overlap
                          // => min_age < minAge && max_age <= maxAge
                          {
                              $and: [
                                  { min_age: { $lt: minAge } },
                                  { maxAge: { $gte: minAge, $lte: maxAge } },
                              ],
                          },
                          // case 4.2: Intervals [minAge, maxAge] and [min_age, max_age] overlap
                          // => min_age >= minAge && max_age > maxAge
                          {
                              $and: [
                                  { min_age: { $gte: minAge, $lte: maxAge } },
                                  { maxAge: { $gt: maxAge } },
                              ],
                          },
                      ],
                  },
        ],
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
