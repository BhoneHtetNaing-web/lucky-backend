const Joi = require('joi');

const createBookingSchema = Joi.object({
    flight_id: Joi.string().required(),
    total_price: Joi.number().required(),

    passengers: Joi.array()
    .items (
        Joi.object({
        full_name: Joi.string().required(),
        passport_number: Joi.string().required(),
        nationality: Joi.string().optional(),
        })
    )
    .min(1)
    .required(),
});

module.exports = { createBookingSchema };