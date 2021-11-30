import Joi from 'joi';

export const CreateFolderSchema = Joi.object({
  password: Joi.string().min(4).max(256).default('').trim(),

  protected: Joi.boolean().default(true).required(),
});

export const FolderDownloadSchema = Joi.object({
  'folder-key': Joi.string().min(4).max(256).trim(),
});
