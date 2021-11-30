import { HeaderGuard, JWTGuard, ParamGuard, SchemaGuard } from '@backend/middleware';
import { RoleGuard } from '@backend/middleware/role.guard';
import { CreateFolderSchema, FileDownloadSchema, IdSchema } from '@lib/schema';
import { CLIENT_ERROR, UserRoleType } from '@lib/shared';
import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import { db } from '@lib/db';
import { FolderGuard } from '@backend/middleware/folder.guard';
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
  '/:id',
  JWTGuard({ passthrough: true }),
  ParamGuard(IdSchema),
  HeaderGuard(FileDownloadSchema),
  RoleGuard([UserRoleType.USER], { passthrough: true }),
  FolderGuard(),
  async (ctx: ParameterizedContext) => {
    const folder = await db.folder.findUnique({ where: { folderId: ctx.params.id } });

    if (folder) {
      ctx.body = {
        ...folder,
        password: !!folder.password,
      };
    } else {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, CLIENT_ERROR.NOT_FOUND.message);
    }
  },
); // {get} /folder/:id

export { router as FolderController };
