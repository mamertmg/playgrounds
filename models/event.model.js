const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    playground_id: {
        type: Schema.Types.ObjectId,
        ref: 'Playground',
        required: true,
    },
    status: {
        type: Number,
        required: true
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
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
