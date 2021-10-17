import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { PrismaClient } from '@prisma/client';

import { validateAuthorization } from '../../middleware';
import { StatusCodes } from 'pndome/lib/util';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.post('/',
 validateAuthorization({ passthrough: false, }),
 async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;
	 
	ctx.status = StatusCodes.SUCCESS.OK.status;
	ctx.body = StatusCodes.SUCCESS.OK.message;
 }
);

router.get('/:fileId',
validateAuthorization({ passthrough: true, }),
	async (ctx: ParameterizedContext) => {
		const body = ctx.request.body;
		const db: PrismaClient = ctx.db;
		
		ctx.status = StatusCodes.SUCCESS.OK.status;
		ctx.body = StatusCodes.SUCCESS.OK.message;
	}
);

export {
	router as FileController
};