const Joi = require('joi');

const validateCoin = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().allow('').optional(),
    year: Joi.number().integer().min(1).max(new Date().getFullYear() + 1).optional(),
    country_id: Joi.number().integer().positive().required(),
    denomination_id: Joi.number().integer().positive().required(),
    material_id: Joi.number().integer().positive().required(),
    condition_id: Joi.number().integer().positive().optional(),
    face_value: Joi.string().max(50).optional(),
    weight: Joi.number().precision(3).min(0).optional(),
    diameter: Joi.number().precision(2).min(0).optional(),
    thickness: Joi.number().precision(2).min(0).optional(),
    edge: Joi.string().max(100).optional(),
    mint_mark: Joi.string().max(50).optional(),
    series: Joi.string().max(255).optional(),
    obverse_design: Joi.string().allow('').optional(),
    reverse_design: Joi.string().allow('').optional(),
    images: Joi.array().items(Joi.string()).optional(),
    rarity: Joi.string().max(50).optional(),
    estimated_value: Joi.number().min(0).optional(),
    notes: Joi.string().allow('').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }

  next();
};

module.exports = {
  validateCoin
};