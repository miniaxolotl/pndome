import { FolderGuard, HeaderGuard, JWTGuard, ParamGuard, SchemaGuard } from '@backend/middleware';
import { RoleGuard } from '@backend/middleware/role.guard';
import { FileDownloadSchema, IdSchema } from '@lib/schema';
import { SUCCESS, UserRoleType } from '@lib/shared';
import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import fetch from 'node-fetch';
import path from 'path';
import config from '../../../../../../server.config';
import { db } from '@lib/db';

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
            file.media ? config.BUNNYCDN_API_MEDIA : config.BUNNYCDN_API
          }/uploads/${filePath}`,
          {
            method: 'GET',
            headers: {
              AccessKey: file.media ? config.BUNNYCDN_API_MEDIA_KEY : config.BUNNYCDN_API_KEY,
            },
          },
        );
        response.body.on('error', () => void 0);
        ctx.status = SUCCESS.PARTIAL_CONTENT.status;
        ctx.body = response.body;
        return;
      } else {
        ctx.response.set('content-type', file.type);
        ctx.response.set('content-length', `${file.bytes}`);
        ctx.response.set('accept-ranges', 'bytes');
        ctx.response.set('connection', 'keep-alive');
        ctx.response.set('content-disposition', `inline; filename="${file.name}"`);

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
        response.body.on('error', () => void 0);
        ctx.status = SUCCESS.OK.status;
        ctx.body = response.body;
      }
    }
  },
); // {get} /stream/:id

export { router as StreamController };
