const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    playground_id: {
        type: Schema.Types.ObjectId,
        ref: 'Playground',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    info_link: {
        type: String,
    },
    // user_id: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    // },
});

const Event = mongoose.Model('Event', eventSchema);

module.exports = Event;
