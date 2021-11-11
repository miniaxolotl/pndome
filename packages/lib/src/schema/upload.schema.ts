import Joi from 'joi';

export default Joi.object({
  folderId: Joi.string().default(null),

  password: Joi.string().default(null).min(3),

  protected: Joi.boolean().required(),
});
