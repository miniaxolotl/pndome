import Joi from 'joi';

export const RoleSchema = Joi.object({
  id: Joi.string().min(16).max(16).alphanum().lowercase().required(),
  role: Joi.string().min(1).required(),
});

export interface RoleValues {
  id: string;
  role: string;
}
