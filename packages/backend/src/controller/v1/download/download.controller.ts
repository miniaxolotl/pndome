import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import fetch from 'node-fetch';
import path from 'path';

import { FileHelper } from '../file';
import { RoleGuard } from '@backend/middleware/role.guard';
import { UserRoleType } from '@lib/shared';
import { db } from '@lib/db';
import { FileDownloadSchema, IdSchema } from '@lib/schema';
import { FolderGuard, HeaderGuard, JWTGuard, ParamGuard } from '@backend/middleware';

import config from '../../../../../../server.config';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.get(
  '/:id',
  JWTGuard({ passthrough: true }),
  ParamGuard(IdSchema),
  HeaderGuard(FileDownloadSchema),
  RoleGuard([UserRoleType.USER], { passthrough: true }),
  FolderGuard(),
  async (ctx: ParameterizedContext) => {
    const file = await db.file.findUnique({ where: { fileId: ctx.params.id } });
    FileHelper.incrementDownloadCount(ctx.params.id);

    if (file) {
      const filePath = path.join(file.folderId, path.join(`${file.fileId}.${file.ext}`));
      const response = await fetch(
        `https://${
          file.media ? config.BUNNYCDN_API_MEDIA : config.BUNNYCDN_API
        }/uploads/${filePath}`,
        {
          method: 'GET',
          headers: {
            AccessKey: file.media ? config.BUNNYCDN_API_MEDIA_KEY : config.BUNNYCDN_API_KEY,
          },
        },
      );
      ctx.response.set('content-type', file.type);
      ctx.response.set('content-length', `${file.bytes}`);
      ctx.response.set('accept-ranges', 'bytes');
      ctx.response.set('connection', 'keep-alive');
      ctx.response.set('content-disposition', `inline; filename="${file.name}"`);

      ctx.body = response.body;
    }
  },
); // {get} /download/:id

export { router as DownloadController };
