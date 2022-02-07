const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewRating = new Schema({
    rating: Number,
    playground: {
        type: Schema.Types.ObjectId,
        ref: 'Playground'
    }
});

module.exports = mongoose.model("Rating", reviewRating);