import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { ParamGuard } from '@backend/middleware';
import { SearchSchema } from '@lib/schema';
import { UserRoleType } from '@lib/shared';
import { RoleHelper } from '.';
import { SessionGuard } from '@backend/middleware/session.guard';
import { RoleGuard } from '@backend/middleware/role.guard';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

/**
 * show all roles
 */
router.get(
  '/',
  SessionGuard(),
  RoleGuard([UserRoleType.ADMIN]),
  ParamGuard(SearchSchema),
  async (ctx: ParameterizedContext) => {
    const roles = await RoleHelper.findAll(ctx.param);
    ctx.body = roles;
  },
); // {get} /role/

export { router as RoleController };
