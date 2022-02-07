const AppError = require('../utils/AppError');
const { playgroundSchema } = require('../utils/validationSchema');

module.exports.validatePlayground = (req, res, next) => {
    const { error } = playgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
};
