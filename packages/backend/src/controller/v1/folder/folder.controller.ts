import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import _ from 'lodash';

import { FolderGuard } from '@backend/middleware/folder.guard';
import { RoleGuard } from '@backend/middleware/role.guard';
import { db } from '@libs/database';
import { CLIENT_ERROR, UserRoleType } from '@libs/shared';
import {
  CreateFolderSchema,
  FileDownloadSchema,
  FolderAccessSchema,
  FolderKeySchema,
  FolderPatchSchema,
  IdSchema,
  SearchSchema,
} from '@libs/shared';
import { HeaderGuard, JWTGuard, ParamGuard, SchemaGuard } from '@backend/middleware';

import { FolderHelper } from '.';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.post(
  '/',
  JWTGuard({ passthrough: true }),
  RoleGuard([UserRoleType.USER], { passthrough: true }),
  SchemaGuard(CreateFolderSchema),
  async (ctx: ParameterizedContext) => {
    const data = ctx.data;
    const folder = {
      ...(await FolderHelper.createFolder({
        userId: ctx.state.userId,
        password: data.password,
        isProtected: data.protected && ctx.state.userId ? true : false,
      })),
      password: (data.password ? true : false) as unknown as string,
    };
    if (folder) {
      ctx.body = folder;
    } else {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, CLIENT_ERROR.NOT_FOUND.message);
    }
  },
); // {post} /folder

router.get(
  '/me',
  JWTGuard(),
  RoleGuard([UserRoleType.USER]),
  HeaderGuard(FileDownloadSchema),
  ParamGuard(SearchSchema),
  async (ctx: ParameterizedContext) => {
    const files = await FolderHelper.findByUserId(ctx.state.userId, ctx.params);
    ctx.body = files;
  },
); // {get} /folder/:id

router.get(
  '/:id',
  JWTGuard({ passthrough: true }),
  ParamGuard(IdSchema),
  HeaderGuard(FolderKeySchema),
  RoleGuard([UserRoleType.USER], { passthrough: true }),
  FolderGuard(),
  async (ctx: ParameterizedContext) => {
    const folder = await db.folder.findUnique({ where: { folderId: ctx.params.id } });
    FolderHelper.incrementDownloadCount(ctx.params.id);
    if (folder && !folder.deleted) {
      ctx.body = {
        ...folder,
        password: !!folder.password,
      };
    } else {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, CLIENT_ERROR.NOT_FOUND.message);
    }
  },
); // {get} /folder/:id

router.patch(
  '/:id',
  JWTGuard(),
  SchemaGuard(FolderPatchSchema),
  ParamGuard(IdSchema),
  HeaderGuard(FileDownloadSchema),
  RoleGuard([UserRoleType.USER]),
  FolderGuard({ owner: true }),
  async (ctx: ParameterizedContext) => {
    const { id } = ctx.params;
    const folder = await db.folder.findUnique({ where: { folderId: id } });

    if (_.isEmpty(folder) || folder?.deleted) {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'folder does not exist');
    }

    const updatedFolder = await FolderHelper.patchFolder(id, ctx.data);
    ctx.body = { ...updatedFolder, password: !!updatedFolder.password };
  },
); // {get} /folder/:id

router.delete(
  '/:id',
  JWTGuard(),
  ParamGuard(FolderAccessSchema),
  HeaderGuard(FolderKeySchema),
  RoleGuard([UserRoleType.USER]),
  FolderGuard({ owner: true }),
  async (ctx: ParameterizedContext) => {
    const { id } = ctx.params;
    const folder = await db.folder.findUnique({ where: { folderId: id } });

    if (_.isEmpty(folder) || folder?.deleted) {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'folder does not exist');
    }

    const updatedFolder = await FolderHelper.deleteFolder(id);
    ctx.body = { ...updatedFolder, password: !!updatedFolder.password };
  },
); // {get} /folder/:id

router.put(
  '/:id/:userId',
  JWTGuard(),
  ParamGuard(FolderAccessSchema),
  HeaderGuard(FolderKeySchema),
  RoleGuard([UserRoleType.USER]),
  FolderGuard({ owner: true }),
  async (ctx: ParameterizedContext) => {
    const { id, userId } = ctx.params;
    const folder = await db.folder.findUnique({
      where: { folderId: id },
      include: { users: { where: { userId } } },
    });

    if (!folder || _.isEmpty(folder) || folder?.deleted) {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'folder does not exist');
    }

    if (folder.users && folder.users.length) {
      ctx.throw(CLIENT_ERROR.BAD_REQUEST.status, 'user already has access to folder');
    }

    const updatedFolder = await FolderHelper.addUserAccess(folder.folderId, userId);
    ctx.body = updatedFolder;
  },
); // {get} /folder/:id

router.delete(
  '/:id/me',
  JWTGuard(),
  ParamGuard(IdSchema),
  HeaderGuard(FolderKeySchema),
  RoleGuard([UserRoleType.USER]),
  FolderGuard(),
  async (ctx: ParameterizedContext) => {
    const { id } = ctx.params;
    const userId = ctx.state.userId;
    const folder = await db.folder.findUnique({
      where: { folderId: id },
      include: { users: { where: { userId } } },
    });

    if (!folder || _.isEmpty(folder) || folder?.deleted) {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'folder does not exist');
    }

    if (folder.users && !folder.users.length) {
      ctx.throw(CLIENT_ERROR.UNAUTHORIZED.status, 'user does not have access to folder');
    }

    if (folder.users[0].owner) {
      ctx.throw(CLIENT_ERROR.BAD_REQUEST.status, 'cannot revoke access to owner of folder');
    }

    const updatedFolder = await FolderHelper.revokeUserAccess(folder.folderId, userId);
    ctx.body = updatedFolder;
  },
); // {get} /folder/:id

router.delete(
  '/:id/:userId',
  JWTGuard(),
  ParamGuard(FolderAccessSchema),
  HeaderGuard(FolderKeySchema),
  RoleGuard([UserRoleType.USER]),
  FolderGuard({ owner: true }),
  async (ctx: ParameterizedContext) => {
    const { id, userId } = ctx.params;
    const folder = await db.folder.findUnique({
      where: { folderId: id },
      include: { users: { where: { userId } } },
    });

    if (!folder || _.isEmpty(folder) || folder?.deleted) {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'folder does not exist');
    }

    if (folder.users && !folder.users.length) {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, 'user does not have access to folder');
    }

    const updatedFolder = await FolderHelper.revokeUserAccess(folder.folderId, userId);
    ctx.body = updatedFolder;
  },
); // {get} /folder/:id

export { router as FolderController };
