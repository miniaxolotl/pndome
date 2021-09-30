import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.get('/', async (ctx: ParameterizedContext) => {
	ctx.body = 'Hello World';
});

export {
	router as JWTController,
};