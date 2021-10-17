import { PrismaClient } from "@prisma/client";
import { ParameterizedContext } from "koa";

import { StatusCodes } from "pndome/lib/util";

export const validateAuthorization = (
	options: {
		passthrough?: boolean;
	}
) => {
	return async (
		ctx: ParameterizedContext,
		next: any
	) => {
		const db: PrismaClient = ctx.db;

		const authorization_key = (ctx.headers.authorization);
		let sessionId: string = "";

		if (authorization_key) {
			sessionId = authorization_key.split(' ')[1] ?? "";
		} else if ((ctx.session as any).user && (ctx.session as any).user.sessionId) {
			sessionId = (ctx.session as any).user.sessionId;
		}

		const session = await db.session.findFirst({
			where:{
				sessionId: sessionId
			}
		});

		const user = await db.user.findFirst({
			where:{
				userId: session?.userId
			}
		});

		const state = {
			sessionId: session?.sessionId,
			userId: user?.userId,
			username: user?.username,
			email: user?.email,
		};

		ctx.state = state;
		(ctx.session as any).user = state;

		if(options.passthrough) {
			await next();
		} else {
			if(session && session.valid) {
				if(session.expires < new Date()) {
					const expireSession = await db.session.update({
						where: {
							sessionId: session.sessionId
						},
						data: {
							valid: false,
						}
					});
					
					if(expireSession) {
						ctx.status = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.status;
						ctx.body = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.message;
						return;
					} else {
						ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
						ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
						return;
					}
				} else {
					await next();
				}
			} else {
				console.log(session);
				ctx.status = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.status;
				ctx.body = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.message;
				return;
			}
		}
	}
};