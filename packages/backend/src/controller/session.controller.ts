import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { Prisma, PrismaClient } from '@prisma/client';

import { uid } from 'uid/secure';
import { v4 as uuid } from 'uuid';

import { LoginSchema, RegisterSchema } from 'pndome/lib/schema';
import { Bcrypt, StatusCodes } from 'pndome';
import { findUser } from 'pndome/lib/Session';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.post('/register', async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;

	const { value, error } = RegisterSchema.validate(body, {
		abortEarly: false,
		errors: { escapeHtml: true }
	});

	if(error) {
		ctx.status = StatusCodes.CLIENT_ERROR.BAD_REQUEST.status;
		ctx.body = StatusCodes.CLIENT_ERROR.BAD_REQUEST.message;
		return;
	} else {
		const user = await findUser(db, value);
		if(user) {
			ctx.status = StatusCodes.CLIENT_ERROR.CONFILCT.status;
			ctx.body = StatusCodes.CLIENT_ERROR.CONFILCT.message;
			return;
		} else {
			const passwordHash: string | null = await Bcrypt.genHash(value.password);
			const userId: string = uid(16);
			const sessionId: string = uuid();

			const createUser = db.user.create({
				data: {
					userId: userId,
					username: value.username,
					password: passwordHash,
					email: value.email,
				}
			});

			const createSession = db.session.create({
				data: {
					sessionId: sessionId,
					userId: userId,
				}
			});

			const success = await db.$transaction([createUser, createSession]);

			if(success[0] && success[1]) {
				const response = {
					sessionId: sessionId,
					userId: userId,
					username: value.username,
					email: value.email,
				};
				(ctx.session as any).user = response;
				ctx.status = StatusCodes.SUCCESS.CREATED.status;
				ctx.body = response;
				return;
			} else {
				ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
				ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
				return;
			}
		}
	}
});

router.post('/login', async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;

	const { value, error } = LoginSchema.validate(body, {
		abortEarly: false,
		errors: { escapeHtml: true }
	});

	if(error) {
		ctx.status = StatusCodes.CLIENT_ERROR.BAD_REQUEST.status;
		ctx.body = StatusCodes.CLIENT_ERROR.BAD_REQUEST.message;
		return;
	} else {
		const user = await findUser(db, value);
		if(user) {
			if(await Bcrypt.compare(value.password, user.password)) {
				const sessionId: string = uuid();

				const disableAllSessions = db.session.updateMany({
					where: {
						userId: user.userId,
						valid: true,
					},
					data: {
						valid: false,
					}
				});

				const createSession = db.session.create({
					data: {
						sessionId: sessionId,
						userId: user.userId,
					}
				});

				const success = await db.$transaction([
					disableAllSessions,
					createSession
				]);

				if(success[0] && success[1]) {
					const response = {
						sessionId: sessionId,
						userId: user.userId,
						username: user.username,
						email: user.email,
					};
					(ctx.session as any).user = response;
					ctx.status = StatusCodes.SUCCESS.CREATED.status;
					ctx.body = response;
					return;
				} else {
					ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
					ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
					return;
				}
			}
		} else {
			ctx.status = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.status;
			ctx.body = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.message;
			return;
		}
	}
});

router.post("/logout", async (ctx: ParameterizedContext) => {
	const body = ctx.request.body;
	const db: PrismaClient = ctx.db;

	const session = (ctx.session as any).user.session;

	const disableAllSessions = await db.session.updateMany({
		where: {
			sessionId: session,
			valid: true,
		},
		data: {
			valid: false,
		}
	});
	
	if(disableAllSessions.count > 0) { 
		(ctx.session as any).user = {
			sessionId: null,
			userId: null,
			username: null,
			email: null,
		};
	
		ctx.status = StatusCodes.SUCCESS.OK.status;
		ctx.body = StatusCodes.SUCCESS.OK.message;
		return;
	} else {
		ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
		ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
		return;
	}
});

export {
	router as SessionController,
};