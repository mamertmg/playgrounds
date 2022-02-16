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

module.exports.eventSchema = Joi.object({
    event: Joi.object({
        name: Joi.string().required(),
        date: Joi.date().required(),
        time: Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/).required(),
        info_link: Joi.string().required(),
    }).required(),
    _csrf: Joi.string(),
});
