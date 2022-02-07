const Joi = require('joi');

module.exports.playgroundSchema = Joi.object({
    playground: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().allow(''),
        type: Joi.string().required(),
        lat: Joi.number().min(-90.0).max(90.0),
        lng: Joi.number().min(-180.0).max(180.0),
        age_group: Joi.string().allow(''),
        description: Joi.string().allow(''),
        equipment: Joi.string().allow(''),
    }).required(),
    _csrf: Joi.string(),
});
