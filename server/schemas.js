const BaseJoi = require("joi");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = value.replace(/<\/?[^>]+(>|$)/g, "");

        if (clean !== value) {
          return helpers.error("string.escapeHTML", { value });
        }

        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),
  location: Joi.string().required().escapeHTML(),
  rating: Joi.number(),
  visits: Joi.number(),
  favorites: Joi.number(),
  position: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
  price: Joi.number().required().min(0),
  description: Joi.string().required().escapeHTML(),
  deleteImages: Joi.array(),
}).required();

module.exports.reviewSchema = Joi.object({
  body: Joi.string().required().escapeHTML(),
  rating: Joi.number().required().min(1).max(5),
}).required();
