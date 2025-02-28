import Joi from 'joi';

export const validateSchemaSendResetEmail = Joi.object({
  email: Joi.string().required().email(),
});

export const validateSchemaResetPsw = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
