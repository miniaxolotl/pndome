import { PrismaClient } from "@prisma/client";
import { ParameterizedContext } from "koa";
import { StatusCodes } from "pndome";

export const validateSession = (
	options: {
		passthrough?: boolean;
	}
) => {
	return async (
		ctx: ParameterizedContext,
		next: any
	) => {
		const db: PrismaClient = ctx.db;

		if((ctx.session as any).user && (ctx.session as any).user.sessionId) {
			const sessionId = (ctx.session as any).user.sessionId;

			const session = await db.session.findFirst({
				where:{
					sessionId: sessionId
				}
			});

			if(session) {
				if(session.expires > new Date()) {
					const disableAllSessions = await db.session.updateMany({
						where: {
							sessionId: session.sessionId,
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
				} else {
					ctx.state = (ctx.session as any).user;
					await next();
				}
			} else {
				ctx.status = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.status;
				ctx.body = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.message;
				return;
			}
		} else {
			if(options.passthrough) {
				(ctx.session as any).user = {
					sessionId: null,
					userId: null,
					username: null,
					email: null,
				};
				ctx.state = (ctx.session as any).user;
				await next();
			} else {
				ctx.status = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.status;
				ctx.body = StatusCodes.CLIENT_ERROR.UNAUTHORIZED.message;
				return;
			}
		}
	}
};