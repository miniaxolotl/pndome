import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import fetch from 'node-fetch';
import path from 'path';

import { RoleGuard } from '@backend/middleware/role.guard';
import { ServerConfig } from '@libs/config';
import { db } from '@libs/database';
import { FileDownloadSchema, IdSchema } from '@libs/shared';
import { FolderGuard, HeaderGuard, JWTGuard, ParamGuard } from '@backend/middleware';
import { SUCCESS, UserRoleType } from '@libs/shared';

import { FileHelper } from '../file';

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

    if (file) {
      const filePath = path.join(file.folderId, path.join(`${file.fileId}.${file.ext}`));

      const range = ctx.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : file.bytes - 1;
        const chunk_size = end - start + 1;

        ctx.response.set('connection', 'keep-alive');
        ctx.response.set('content-type', file.type);
        ctx.response.set('content-length', chunk_size.toString());
        ctx.response.set('accept-ranges', 'bytes');
        ctx.response.set('content-range', `bytes ${start}-${end}/${file.bytes}`);
        ctx.response.set('content-disposition', `inline; filename="${file.name}"`);

        const response = await fetch(
          `https://${
            file.media ? ServerConfig.BUNNYCDN_API_MEDIA : ServerConfig.BUNNYCDN_API
          }/uploads/${filePath}`,
          {
            method: 'GET',
            headers: {
              AccessKey: file.media
                ? ServerConfig.BUNNYCDN_API_MEDIA_KEY
                : ServerConfig.BUNNYCDN_API_KEY,
            },
          },
        );
        response.body.on('error', () => void 0);
        ctx.status = SUCCESS.PARTIAL_CONTENT.status;
        ctx.body = response.body;
        return;
      } else {
        FileHelper.incrementDownloadCount(ctx.params.id);
        ctx.response.set('content-type', file.type);
        ctx.response.set('content-length', `${file.bytes}`);
        ctx.response.set('accept-ranges', 'bytes');
        ctx.response.set('connection', 'keep-alive');
        ctx.response.set('content-disposition', `inline; filename="${file.name}"`);

        const response = await fetch(
          `https://${
            file.media ? ServerConfig.BUNNYCDN_API_MEDIA : ServerConfig.BUNNYCDN_API
          }/uploads/${filePath}`,
          {
            method: 'GET',
            headers: {
              AccessKey: file.media
                ? ServerConfig.BUNNYCDN_API_MEDIA_KEY
                : ServerConfig.BUNNYCDN_API_KEY,
            },
          },
        );
        response.body.on('error', () => void 0);
        ctx.status = SUCCESS.OK.status;
        ctx.body = response.body;
      }
    }
  },
); // {get} /stream/:id

export { router as StreamController };
