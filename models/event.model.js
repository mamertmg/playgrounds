const mongoose = require('mongoose');
const Playground = require('./playground.model');
const User = require('./user.model');
const Schema = mongoose.Schema;

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
        await User.findByIdAndUpdate(event.author.id, {"$pull": {"events": event._id}});
        await Playground.findByIdAndUpdate(event.playground_id, {"$pull": {"events": event._id}});
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
