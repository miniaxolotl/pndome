import Joi from 'joi';

export const FileUploadSchema = Joi.object({
  folderId: Joi.string().max(16).min(16),

  password: Joi.string().min(8).max(256).trim(),

  protected: Joi.boolean().default(true).required(),
});
