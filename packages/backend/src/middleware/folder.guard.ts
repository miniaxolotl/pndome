import { compare, db } from 'lib/src';
import { CLIENT_ERROR } from '@lib/shared';
import { ParameterizedContext } from 'koa';

export const FolderGuard = () => {
  return async (ctx: ParameterizedContext, next: () => Promise<void>) => {
    if (ctx.params.id) {
      const file = await db.file.findUnique({ where: { fileId: ctx.params.id } });
      const folder = await db.folder.findUnique({
        where: { folderId: file?.folderId ?? ctx.params.id },
      });
      if (folder) {
        // NOTEe: folder has password
        if (folder.password) {
          const password: string = ctx.headerData['folder-key'] as string;
          if (!password || !(await compare(password, folder.password)))
            ctx.throw(CLIENT_ERROR.UNAUTHORIZED.status, CLIENT_ERROR.UNAUTHORIZED.message);
        }
        // NOTEe: folder is protected
        if (folder.protected && ctx.state.userId) {
          const userFolder = await db.userFolder.findUnique({
            where: {
              userId_folderId: {
                folderId: folder.folderId,
                userId: ctx.state.userId,
              },
            },
          });
          if (!userFolder)
            ctx.throw(CLIENT_ERROR.UNAUTHORIZED.status, CLIENT_ERROR.UNAUTHORIZED.message);
        }
      } else {
        ctx.throw(CLIENT_ERROR.NOT_FOUND.status, CLIENT_ERROR.NOT_FOUND.message);
      }
      return await next();
    } else {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, CLIENT_ERROR.NOT_FOUND.message);
    }
  };
};
