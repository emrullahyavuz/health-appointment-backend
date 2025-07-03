const Joi = require('joi');

// Kullanıcı kaydı için şema
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('user', 'admin', 'doctor').required(),
});

// Kullanıcı girişi için şema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
}; 