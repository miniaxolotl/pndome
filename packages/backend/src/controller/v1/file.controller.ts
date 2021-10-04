import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { validateSession } from '../../middleware';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.get('/:fileId',
	validateSession({ passthrough: true, }),
	async (ctx: ParameterizedContext) => {
		console.log(ctx.state);
		
		ctx.body = 'Hello World';
	}
);

export {
	router as FileController
};