import { ParameterizedContext } from 'koa';

import { CLIENT_ERROR } from '@lib/shared';
import { compare, db } from 'lib/src';

export const FolderGuard = (options: { owner } = { owner: false }) => {
  return async (ctx: ParameterizedContext, next: () => Promise<void>) => {
    if (ctx.params.id) {
      const file = await db.file.findUnique({ where: { fileId: ctx.params.id } });
      const folder = await db.folder.findUnique({
        where: { folderId: file?.folderId ?? ctx.params.id },
        include: { users: { where: { userId: ctx.state.userId } } },
      });
      const user = folder?.users.pop();
      if (folder && (user || !options.owner)) {
        // NOTE: folder has password
        if (folder.password) {
          const password: string = ctx.headerData['folder-key'] as string;
          if (!password || !(await compare(password, folder.password)))
            ctx.throw(CLIENT_ERROR.UNAUTHORIZED.status, CLIENT_ERROR.UNAUTHORIZED.message);
        }
        // NOTE: folder is protected
        if (folder.protected && !user?.access) {
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
