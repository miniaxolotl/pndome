import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { PrismaClient } from '@prisma/client';

import { StatusCodes } from 'pndome/lib/util';
import { createUser, findUser, validateCreateUserRequest } from 'pndome/lib/service/User';

const router: Router = new Router();

/************************************************
 * routescreateUser
 ************************************************/

 router.post('/', async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;

	const req = validateCreateUserRequest(body);

	if(req) {
		const user = await findUser(db, req.username);
		if(user) {
			ctx.status = StatusCodes.CLIENT_ERROR.CONFILCT.status;
			ctx.body = StatusCodes.CLIENT_ERROR.CONFILCT.message;
			return;
		} else {
			const newUser = await createUser(db, req);
			if(newUser) {
				ctx.status = StatusCodes.SUCCESS.CREATED.status;
				ctx.body = {
						userId: newUser.userId,
						username: newUser.username,
						email: newUser.email,
					};
					return;
			} else {
				ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
				ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
				return;
			}
		}
	} else {
		ctx.status = StatusCodes.CLIENT_ERROR.BAD_REQUEST.status;
		ctx.body = StatusCodes.CLIENT_ERROR.BAD_REQUEST.message;
		return;
	}
});

export {
	router as UserController
};