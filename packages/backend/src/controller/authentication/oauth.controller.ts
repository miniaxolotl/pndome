import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import { StatusCodes } from 'pndome/lib/util';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.get('/', async (ctx: ParameterizedContext) => {
	ctx.status = StatusCodes.SERVER_ERROR.NOT_IMPLEMENTED.status;
	ctx.body = StatusCodes.SERVER_ERROR.NOT_IMPLEMENTED.message;
});

export {
	router as OAuthController,
};