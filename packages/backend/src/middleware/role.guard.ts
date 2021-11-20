import { CLIENT_ERROR, UserRoleType } from '@lib/shared';
import { RoleType } from '@lib/type';

import { ParameterizedContext } from 'koa';
import _ from 'lodash';

const NO_AUTHORITY = 1000;

export const RoleGuard = (roles: RoleType[]) => {
  return async (ctx: ParameterizedContext, next: () => Promise<void>) => {
    // const userRoles = await db.userRole.findMany({
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   where: { userId: (ctx.session as any).user.userId },
    //   include: { role: true },
    // });
    const userRoles = ctx.state.roles;

    // FIXME: overengineered lol, but it works
    // NOTE: Reduce to highest authority (lowest number)
    const authority = userRoles.reduce((acc, userRole) => {
      return roles.reduce((acc, role) => {
        return UserRoleType[_.upperCase(userRole)].authority <= role.authority
          ? UserRoleType[_.upperCase(userRole)].authority
          : acc;
      }, 1000) <= acc
        ? UserRoleType[_.upperCase(userRole)].authority
        : acc;
    }, 1000);

    if (authority < NO_AUTHORITY) await next();
    else {
      ctx.status = CLIENT_ERROR.UNAUTHORIZED.status;
      ctx.body = CLIENT_ERROR.UNAUTHORIZED.message;
    }
  };
};
