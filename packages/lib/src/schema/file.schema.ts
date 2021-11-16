import Joi from 'joi';

export const UploadSchema = Joi.object({
  folderId: Joi.string().default(null),

  password: Joi.string().min(8).max(256).trim().default(null),

  protected: Joi.boolean().default(true).required(),
});
