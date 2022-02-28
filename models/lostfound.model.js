const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lostFoundSchema = new Schema({
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
    contact: {
        type: String,
        required: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

const LostFound = mongoose.model('LostFound', lostFoundSchema);

module.exports = LostFound;
