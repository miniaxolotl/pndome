import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { StatusCodes } from 'lib/src';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.all('/', async (ctx: ParameterizedContext) => {
  ctx.status = StatusCodes.SERVER_ERROR.NOT_IMPLEMENTED.status;
  ctx.body = StatusCodes.SERVER_ERROR.NOT_IMPLEMENTED.message;
}); // {post} /session

export { router as SessionController };
