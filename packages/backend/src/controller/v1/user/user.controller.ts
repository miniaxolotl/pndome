import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { ValidateParam, ValidateSchema } from '@backend/middleware';
import { UserValues } from '@lib/type';
import { IdSchema, RoleSchema, RoleValues, SearchSchema, UserSchema } from '@lib/schema';
import { CLIENT_ERROR, StatusCodes } from '@lib/shared';
import { UserHelper } from '.';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

/**
 * create a new user
 */
router.post('/', ValidateSchema(UserSchema), async (ctx: ParameterizedContext) => {
  const data: UserValues = ctx.data;

  const result = await UserHelper.create(data);
  if (result) return (ctx.body = result);
  else ctx.throw(CLIENT_ERROR.CONFILCT.message, CLIENT_ERROR.CONFILCT.status);
}); // {post} /user

/**
 * get all users
 */
router.get('/', ValidateSchema(SearchSchema), async (ctx: ParameterizedContext) => {
  const user = await UserHelper.findByAll(ctx.data);
  if (!user) ctx.throw(CLIENT_ERROR.NOT_FOUND.message, CLIENT_ERROR.NOT_FOUND.status);

  ctx.body = user;
}); // {get} /user/:id

/**
 * get a user by id
 */
router.get('/:id', ValidateParam(IdSchema), async (ctx: ParameterizedContext) => {
  const param: { id: string } = ctx.param;

  const user = await UserHelper.findById(param.id);
  if (!user) ctx.throw(CLIENT_ERROR.NOT_FOUND.message, CLIENT_ERROR.NOT_FOUND.status);

  ctx.body = user;
}); // {get} /user/:id

/**
 * deactivate a user
 */
router.delete('/:id', ValidateParam(IdSchema), async (ctx: ParameterizedContext) => {
  const param: { id: string } = ctx.param;

  const user = await UserHelper.findById(param.id);

  if (!user) ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user does not exist');
  if (user.deleted)
    ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user is already deactivated');

  ctx.body = await UserHelper.deactivate(param.id);
}); // {delete} /user/:id

/**
 * activate a user
 */
router.post('/:id', ValidateParam(IdSchema), async (ctx: ParameterizedContext) => {
  const param: { id: string } = ctx.param;

  const user = await UserHelper.findById(param.id);

  if (!user) ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user does not exist');
  if (!user.deleted)
    ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user is already activated');

  ctx.body = await UserHelper.activate(param.id);
}); // {post} /user/:id

/**
 * add a role to a user
 */
router.post('/:id/:role', ValidateParam(RoleSchema), async (ctx: ParameterizedContext) => {
  const param: RoleValues = ctx.param;

  const user = await UserHelper.findById(param.id);

  if (!user) ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user does not exist');
  if (await UserHelper.hasRole(param.id, param.role))
    ctx.throw(StatusCodes.CLIENT_ERROR.CONFILCT.status, `user already has role ${param.role}`);

  if (await UserHelper.addRole(param.id, param.role)) {
    ctx.status = StatusCodes.SUCCESS.OK.status;
    ctx.body = StatusCodes.SUCCESS.OK.message;
  } else {
    ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
    ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
  }
}); // {post} /user/:id/role

/**
 * delete a role from a user
 */
router.delete('/:id/:role', ValidateParam(RoleSchema), async (ctx: ParameterizedContext) => {
  const param: RoleValues = ctx.param;

  const user = await UserHelper.findById(param.id);

  if (!user) ctx.throw(StatusCodes.CLIENT_ERROR.BAD_REQUEST.status, 'user does not exist');
  if (!(await UserHelper.hasRole(param.id, param.role)))
    ctx.throw(StatusCodes.CLIENT_ERROR.NOT_FOUND.status, `user does not have role ${param.role}`);

  if (await UserHelper.deleteRole(param.id, param.role)) {
    ctx.status = StatusCodes.SUCCESS.OK.status;
    ctx.body = StatusCodes.SUCCESS.OK.message;
  } else {
    ctx.status = StatusCodes.SERVER_ERROR.INTERNAL.status;
    ctx.body = StatusCodes.SERVER_ERROR.INTERNAL.message;
  }
}); // {post} /user/:id/role

export { router as UserController };
