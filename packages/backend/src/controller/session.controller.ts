import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

import { Bcrypt, StatusCodes } from 'pndome';
import { createSession, createUser, findUser, revokeSession, validateRegisterRequest } from 'pndome/lib/Session';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.post('/register', async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;

	const req = validateRegisterRequest(body);

	if(req) {
		const user = await createUser(db, req);
		if(user) {
			const session = await createSession(db, user.userId);
			if(session) {
				ctx.status = StatusCodes.SUCCESS.CREATED.status;
				ctx.body = {
					sessionId: session.sessionId,
					userId: user.userId,
					username: user.username,
					email: user.email,
				};
				return;
			} else {
				ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
				ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
				return;
			}
		} else {
			ctx.status = StatusCodes.CLIENT_ERROR.CONFILCT.status;
			ctx.body = StatusCodes.CLIENT_ERROR.CONFILCT.message;
			return;
		}
	} else {
		ctx.status = StatusCodes.CLIENT_ERROR.BAD_REQUEST.status;
		ctx.body = StatusCodes.CLIENT_ERROR.BAD_REQUEST.message;
		return;
	}
});

router.post('/login', async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;

	const req = validateRegisterRequest(body);

	if(req) {
		const user = await findUser(db, req);
		if(user && await Bcrypt.compare(req.password, user.password)) {
			const session = await createSession(db, user.userId);
			if(session) {
				ctx.status = StatusCodes.SUCCESS.OK.status;
				ctx.body = {
					sessionId: session.sessionId,
					userId: user.userId,
					username: user.username,
					email: user.email,
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