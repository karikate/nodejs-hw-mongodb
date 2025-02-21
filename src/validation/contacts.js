import Joi from 'joi';
import { CONT_BY } from '../constants/contact.js';
import { isValidObjectId } from 'mongoose';

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
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
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
