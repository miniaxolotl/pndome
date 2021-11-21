import jwt from 'jsonwebtoken';
import { db } from 'lib/src';
import { CLIENT_ERROR } from '@lib/shared';
import { ParameterizedContext } from 'koa';
import config from '../../../../server.config';

export const FolderGuard = () => {
  return async (ctx: ParameterizedContext, next: () => Promise<void>) => {
    const file = await db.file.findUnique({ where: { fileId: ctx.params.id } });
    if (file) {
      const folder = await db.folder.findUnique({ where: { folderId: file.folderId } });
      if (folder) {
        if (folder.password && !jwt.verify(folder.password, config.JWT_SECRET))
          ctx.throw(CLIENT_ERROR.UNAUTHORIZED.status, CLIENT_ERROR.UNAUTHORIZED.message);
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
        } else {
          if (folder.protected)
            ctx.throw(CLIENT_ERROR.UNAUTHORIZED.status, CLIENT_ERROR.UNAUTHORIZED.message);
        }
        return await next();
      } else {
        ctx.throw(CLIENT_ERROR.NOT_FOUND.status, CLIENT_ERROR.NOT_FOUND.message);
      }
    } else {
      ctx.throw(CLIENT_ERROR.NOT_FOUND.status, CLIENT_ERROR.NOT_FOUND.message);
    }
  };
};
