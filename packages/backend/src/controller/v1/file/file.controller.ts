import { SERVER_ERROR } from '@lib/shared';
import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.all('/', async (ctx: ParameterizedContext) => {
  ctx.status = SERVER_ERROR.NOT_IMPLEMENTED.status;
  ctx.body = SERVER_ERROR.NOT_IMPLEMENTED.message;
}); // {post} /file

export { router as FileController };
