const mongoose = require('mongoose');
const Review = require('./review.model');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    events: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    lost_found: [
        {
            type: Schema.Types.ObjectId,
            ref: 'LostFound',
        },
    ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
