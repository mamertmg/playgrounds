const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const LostFound = mongoose.model('LostFound', lostFoundSchema);

module.exports = LostFound;
