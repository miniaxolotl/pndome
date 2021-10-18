import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

import { Bcrypt, StatusCodes } from 'pndome/lib/util';
import { createSession, findUser, revokeSession, validateLoginRequest } from 'pndome/lib/service/Session';
import { findRoles } from 'pndome/lib/service/User';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.post('/', async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;

	const req = validateLoginRequest(body);

	if(req) {
		const user = await findUser(db, req.username);
		if(user && await Bcrypt.compare(req.password, user.password!)) {
			const session = await createSession(db, user.userId);
			if(session) {
				ctx.status = StatusCodes.SUCCESS.OK.status;
				ctx.body = {
					sessionId: session.sessionId,
					userId: user.userId,
					username: user.username,
					email: user.email,
					roles:  (await findRoles(db, req.username)).map((val) => val.roleId)
				};
				return;
			} else {
				ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
				ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
				return;
			}
		} else {
			ctx.status = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.status;
			ctx.body = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.message;
			return;
		}
	} else {
		ctx.status = StatusCodes.CLIENT_ERROR.BAD_REQUEST.status;
		ctx.body = StatusCodes.CLIENT_ERROR.BAD_REQUEST.message;
		return;
	}
});

router.post("/revoke", async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;
	
	const sessionId = Joi.object({
		session_id: Joi.string()
		.length(36)
		.required()
	}).validate(body, {
		abortEarly: false,
		errors: { escapeHtml: true }
	}).value;
	
	if(sessionId) {
		if(await revokeSession(db, sessionId)) {
			ctx.status = StatusCodes.SUCCESS.OK.status;
			ctx.body = StatusCodes.SUCCESS.OK.message;
			return;
		} else {
			ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
			ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
			return;
		}
	} else {
		ctx.status = StatusCodes.CLIENT_ERROR.BAD_REQUEST.status;
		ctx.body = StatusCodes.CLIENT_ERROR.BAD_REQUEST.message;
		return;
	}
});

router.post("/revoke_all", async (ctx: ParameterizedContext) => {
	const db: PrismaClient = ctx.db;

	const session = (ctx.session as any).user;

	if(session.sessionId && session.userId) {
		const disableAllSessions = await db.session.updateMany({
			where: {
				sessionId: session.sessionId,
				userId: session.userId,
			},
			data: {
				valid: false,
			}
		});

		if(disableAllSessions) { 
			(ctx.session as any).user = {};
			ctx.status = StatusCodes.SUCCESS.OK.status;
			ctx.body = StatusCodes.SUCCESS.OK.message;
			return;
		} else {
			ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
			ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
			return;
		}
	} else {
		ctx.status = StatusCodes.CLIENT_ERROR.BAD_REQUEST.status;
		ctx.body = StatusCodes.CLIENT_ERROR.BAD_REQUEST.message;
		return;
	}
});

export {
	router as SessionController,
};