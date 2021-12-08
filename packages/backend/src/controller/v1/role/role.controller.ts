import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { RoleGuard } from '@backend/middleware/role.guard';
import { JWTGuard, ParamGuard } from '@backend/middleware';
import { SearchSchema, UserRoleType } from '@libs/shared';

import { RoleHelper } from '.';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

/**
 * show all roles
 */
router.get(
  '/',
  JWTGuard(),
  RoleGuard([UserRoleType.ADMIN]),
  ParamGuard(SearchSchema),
  async (ctx: ParameterizedContext) => {
    const roles = await RoleHelper.findAll(ctx.params);
    ctx.body = roles;
  },
); // {get} /role/

export { router as RoleController };
