import Joi from 'joi';
import { CONT_BY } from '../constants/contact.js';

export const validateSchemaCreate = Joi.object({
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string()
    .min(3)
    .max(20)
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .required()
    .valid(...Object.values(CONT_BY.contactType)),
});

export const validateSchemaUpdate = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string()
    .min(3)
    .max(20)
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...Object.values(CONT_BY.contactType)),
});
