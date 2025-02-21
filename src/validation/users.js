import Joi from 'joi';

export const validateSchemaRegister = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const validateSchemaLogin = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
