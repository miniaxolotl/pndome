import { CLIENT_ERROR } from '@lib/shared';
import { RoleType } from '@lib/type';
import { PrismaClient } from '@prisma/client';
import { ParameterizedContext } from 'koa';

const NO_AUTHORITY = 1000;

export const RoleGuard = (roles: RoleType[]) => {
  return async (ctx: ParameterizedContext, next: () => Promise<void>) => {
    const db: PrismaClient = ctx.db;

    const userRoles = await db.userRole.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: { userId: (ctx.session as any).user.userId },
      include: { role: true },
    });

    // NOTE: Reduce to highest authority (lowest number)
    const authority = userRoles.reduce((acc, userRole) => {
      return roles.reduce((acc, role) => {
        return userRole.role.authority < role.authority ? userRole.role.authority : acc;
      }, 1000) < acc
        ? userRole.role.authority
        : acc;
    }, 1000);

    if (authority < NO_AUTHORITY) await next();
    else {
      ctx.status = CLIENT_ERROR.UNAUTHORIZED.status;
      ctx.body = CLIENT_ERROR.UNAUTHORIZED.message;
    }
  };
};
