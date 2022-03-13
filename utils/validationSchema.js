const Joi = require('joi');

module.exports.playgroundSchema = Joi.object({
    playground: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        type: Joi.string().required(),
        lat: Joi.number().min(-90.0).max(90.0),
        lng: Joi.number().min(-180.0).max(180.0),
        min_age: Joi.number().min(0).max(16).required(),
        max_age: Joi.number().min(0).max(100).required(),
        description: Joi.string().allow(''),
        labels: Joi.array(),
    }).required(),
    _csrf: Joi.string(),
});

module.exports.eventSchema = Joi.object({
    event: Joi.object({
        title: Joi.string().required(),
        date: Joi.date().required(),
        time: Joi.string()
            .regex(/^([0-9]{2})\:([0-9]{2})$/)
            .required(),
        image: Joi.string().allow(''),
        description: Joi.string().allow(''),
        link: Joi.string().allow(''),
    }).required(),
    _csrf: Joi.string(),
});

module.exports.lostFoundSchema = Joi.object({
    lost_found: Joi.object({
        title: Joi.string().required(),
        status: Joi.string().required(),
        date: Joi.date().required(),
        description: Joi.string().required(),
        contact: Joi.string().required(),
    }).required(),
    _csrf: Joi.string(),
});
