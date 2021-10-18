import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { PrismaClient } from '@prisma/client';

import { StatusCodes } from 'pndome/lib/util';
import { createUser, createUserRole, deleteUser, findUserByUsername, validateCreateUserRequest } from 'pndome/lib/service/User';
import Joi from 'joi';

const router: Router = new Router();

/************************************************
 * routescreateUser
 ************************************************/

 router.post('/', async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;

	const req = validateCreateUserRequest(body);

	if(req) {
		const user = await findUserByUsername(db, req.username);
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

router.delete('/:username', async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;
	
	const { value, error } = Joi.object({
		username: Joi.string()
			.alphanum()
			.lowercase()
			.min(3)
			.max(32)
			.required(),
	}).validate(ctx.params)
	if(error) {
		ctx.status = StatusCodes.CLIENT_ERROR.BAD_REQUEST.status;
		ctx.body = StatusCodes.CLIENT_ERROR.BAD_REQUEST.message;
		return;
	}

	const req: { username: string } = value;

	if(req) {
		const user = await findUserByUsername(db, req.username);
		if(user) {
			const deletedUser = await deleteUser(db, user.userId);
			if(deletedUser) {
				ctx.status = StatusCodes.SUCCESS.OK.status;
				ctx.body = StatusCodes.SUCCESS.OK.message;
				return;
			} else {
				ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
				ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
				return;
			}
		} else {
			ctx.status = StatusCodes.CLIENT_ERROR.NOT_FOUND.status;
			ctx.body = StatusCodes.CLIENT_ERROR.NOT_FOUND.message;
			return;
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