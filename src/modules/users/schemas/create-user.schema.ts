import * as Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
  isActive: Joi.boolean().default(true),
});
