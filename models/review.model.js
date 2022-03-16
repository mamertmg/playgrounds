const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        body: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
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
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Review', reviewSchema);
