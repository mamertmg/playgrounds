const AppError = require('../utils/AppError');
const { playgroundSchema, eventSchema } = require('../utils/validationSchema');

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
    try {
        const { date, time } = req.body.event;
        const fullDate = new Date(date + 'T' + time);
        next();
    } catch (e) {
        throw new AppError(e.message, 400);
    }
};
