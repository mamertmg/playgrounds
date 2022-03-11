const AppError = require('../utils/AppError');
const {
    playgroundSchema,
    eventSchema,
    lostFoundSchema,
} = require('../utils/validationSchema');

module.exports.validatePlayground = (req, res, next) => {
    const { error } = playgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
};

module.exports.validateEventDate = (req, res, next) => {
    const { date, time } = req.body.event;
    const fullDate = new Date(date + 'T' + time);
    if (fullDate.toString() === 'Invalid Date') {
        throw new AppError('Invalid event date', 400);
    } else {
        next();
    }
};

module.exports.validateLostFound = (req, res, next) => {
    const { error } = lostFoundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        const { date } = req.body.lost_found;
        const fullDate = new Date(date);
        if (fullDate.toString() === 'Invalid Date') {
            throw new AppError('Invalid date', 400);
        } else {
            next();
        }
    }
};
