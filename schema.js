const Joi=require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    price: Joi.number().required().min(500),
    image: Joi.object({
      url: Joi.string()
    }).optional()
  }).required()
});


module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating:Joi.number().required().min(0).max(10),
        comment:Joi.string().required(),
    }).required()
})