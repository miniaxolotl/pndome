import Joi from 'joi';

export const login = Joi.object({
  username: Joi.string().alphanum().lowercase().min(3).max(32).required(),

  password: Joi.string().min(8).max(64).required(),
});
