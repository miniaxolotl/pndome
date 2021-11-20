import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { JWTGuard, ParamGuard, SchemaGuard } from '@backend/middleware';
import { UserValues } from '@lib/type';
import { IdSchema, RoleSchema, RoleValues, SearchSchema, CreateUserSchema } from '@lib/schema';
import { CLIENT_ERROR, UserRoleType, SERVER_ERROR, SUCCESS } from '@lib/shared';
import { UserHelper } from '.';
import _ from 'lodash';
import { RoleGuard } from '@backend/middleware/role.guard';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

/**
 * create a new user
 */
router.post('/', SchemaGuard(CreateUserSchema), async (ctx: ParameterizedContext) => {
  const data: UserValues = ctx.data;

  const user = await UserHelper.findByEmailOrUsername({
    username: data.username,
    email: data.email,
  });
  if (!_.isEmpty(user)) ctx.throw(CLIENT_ERROR.CONFILCT.status, 'user already exists');

  const result = await UserHelper.create(data);

  if (result) {
    ctx.status = SUCCESS.OK.status;
    ctx.body = result;
  } else {
    ctx.throw(SERVER_ERROR.INTERNAL.status, SERVER_ERROR.INTERNAL.message);
  }
}); // {post} /user

/**
 * get user account
 */
router.get(
  '/me',
  JWTGuard(),
  RoleGuard([UserRoleType.USER]),
  ParamGuard(SearchSchema),
  async (ctx: ParameterizedContext) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await UserHelper.findById((ctx.session as any).user.userId);
    if (_.isEmpty(user)) ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'user does not exist');

    ctx.body = user;
  },
); // {get} /user/me

/**
 * get all users
 */
router.get(
  '/',
  JWTGuard(),
  RoleGuard([UserRoleType.ADMIN]),
  ParamGuard(SearchSchema),
  async (ctx: ParameterizedContext) => {
    const users = await UserHelper.findAll(ctx.param);
    ctx.body = users;
  },
); // {get} /user/

/**
 * get a user by id
 */
router.get(
  '/:id',
  JWTGuard(),
  RoleGuard([UserRoleType.ADMIN]),
  ParamGuard(IdSchema),
  async (ctx: ParameterizedContext) => {
    const param: { id: string } = ctx.param;

    const user = await UserHelper.findById(param.id);
    if (_.isEmpty(user)) ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'user does not exist');

    ctx.body = user;
  },
); // {get} /user/:id

/**
 * activate a user
 */
router.post(
  '/:id',
  JWTGuard(),
  RoleGuard([UserRoleType.MODERATOR]),
  ParamGuard(IdSchema),
  async (ctx: ParameterizedContext) => {
    const param: { id: string } = ctx.param;

    const user = await UserHelper.findById(param.id);

    if (_.isEmpty(user)) ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'user does not exist');

    ctx.body = await UserHelper.activate(param.id);
  },
); // {post} /user/:id

/**
 * deactivate a user
 */
router.delete(
  '/:id',
  JWTGuard(),
  RoleGuard([UserRoleType.MODERATOR]),
  ParamGuard(IdSchema),
  async (ctx: ParameterizedContext) => {
    const param: { id: string } = ctx.param;

    const user = await UserHelper.findById(param.id);

    if (_.isEmpty(user)) ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'user does not exist');

    ctx.body = await UserHelper.deactivate(param.id);
  },
); // {delete} /user/:id

/**
 * add a role to a user
 */
router.post(
  '/:id/:role',
  JWTGuard(),
  RoleGuard([UserRoleType.ADMIN]),
  ParamGuard(RoleSchema),
  async (ctx: ParameterizedContext) => {
    const param: RoleValues = ctx.param;

    const user = await UserHelper.findById(param.id);

    if (_.isEmpty(user)) ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'user does not exist');
    if (await UserHelper.hasRole(param.id, param.role))
      ctx.throw(CLIENT_ERROR.CONFILCT.status, `user already has role ${param.role}`);

    if (await UserHelper.addRole(param.id, param.role)) {
      ctx.status = SUCCESS.OK.status;
      ctx.body = SUCCESS.OK.message;
    } else {
      ctx.status = SERVER_ERROR.INTERNAL.status;
      ctx.body = SERVER_ERROR.INTERNAL.message;
    }
  },
); // {post} /user/:id/role

/**
 * delete a role from a user
 */
router.delete(
  '/:id/:role',
  JWTGuard(),
  RoleGuard([UserRoleType.ADMIN]),
  ParamGuard(RoleSchema),
  async (ctx: ParameterizedContext) => {
    const param: RoleValues = ctx.param;

    const user = await UserHelper.findById(param.id);

    if (_.isEmpty(user)) ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'user does not exist');
    if (!(await UserHelper.hasRole(param.id, param.role)))
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, `user does not have role ${param.role}`);

    if (await UserHelper.deleteRole(param.id, param.role)) {
      ctx.status = SUCCESS.OK.status;
      ctx.body = SUCCESS.OK.message;
    } else {
      ctx.status = SERVER_ERROR.INTERNAL.status;
      ctx.body = SERVER_ERROR.INTERNAL.message;
    }
  },
); // {post} /user/:id/role

export { router as UserController };
