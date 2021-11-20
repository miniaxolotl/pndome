import Joi from 'joi';
import { ParameterizedContext } from 'koa';
import { StatusCodes } from 'lib/src';

export const ParamGuard = (Schema: Joi.ObjectSchema) => {
  return async (ctx: ParameterizedContext, next: () => Promise<void>) => {
    const params = ctx.params;
    const { value, error } = Schema.validate(params, {
      abortEarly: false,
      errors: { escapeHtml: true },
    });
    if (error) {
      ctx.status = StatusCodes.CLIENT_ERROR.BAD_REQUEST.status;
      ctx.body = [];
      error.details.forEach((e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ctx.body as string[]).push(e.message.replace(/"/g, ''));
      });
      return;
    } else {
      ctx.param = value;
      await next();
    }
  };
};
