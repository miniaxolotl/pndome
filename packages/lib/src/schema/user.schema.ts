import Joi from 'joi';

export default Joi.object({
  email: Joi.string().email().required(),

  username: Joi.string().alphanum().lowercase().min(3).max(32).required(),

  password: Joi.string().min(8).max(64).required(),
});
