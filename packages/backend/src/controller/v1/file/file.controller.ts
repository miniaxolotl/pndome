import { HeaderGuard, JWTGuard, ParamGuard, SchemaGuard } from '@backend/middleware';
import { RoleGuard } from '@backend/middleware/role.guard';
import { FileDownloadSchema, FileUploadSchema, IdSchema, SearchSchema } from '@lib/schema';
import { SERVER_ERROR, StatusCodes, SUCCESS, UserRoleType } from '@lib/shared';
import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import FileType from 'file-type';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import config from '../../../../../../server.config';
import { Folder } from '.prisma/client';
import { db } from '@lib/db';
import { FolderHelper } from '../folder';
import { FileHelper } from './file.helper';
import { omit } from 'lodash';
import { FolderGuard } from '@backend/middleware/folder.guard';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.post(
  '/',
  JWTGuard({ passthrough: true }),
  RoleGuard([UserRoleType.USER], { passthrough: true }),
  SchemaGuard(FileUploadSchema),
  async (ctx: ParameterizedContext) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fileList = FileHelper.createFileList((ctx.request as any).files);

    const data = ctx.data;

    if (fileList) {
      let folder: Folder | null;

      // NOTE: create folder
      if (data.folderId) {
        folder = await db.folder.findUnique({ where: { folderId: data.folderId } });
      } else {
        folder = {
          ...(await FolderHelper.createFolder({
            userId: ctx.state.userId,
            password: data.password,
            isProtected: data.protected && ctx.state.userId ? true : false,
          })),
          password: (data.password ? true : false) as unknown as string,
        };
      }

      if (folder) {
        const folderId = folder.folderId;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const files: any = [];

        // NOTE: create file(s)
        for (const file of fileList) {
          if (file) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fileStream = fs.createReadStream((file as any).path);

            const fileType = await FileType.fromStream(fileStream);
            const sha256 = fileStream.pipe(crypto.createHash('sha256')).digest('hex');
            const md5 = fileStream.pipe(crypto.createHash('md5')).digest('hex');

            const newFile = await FileHelper.createFile(
              {
                name: file.name,
                type: fileType?.mime ?? 'application/octet-stream',
                ext: fileType?.ext ?? file.name.split('.').pop() ?? '',
                bytes: file.size,
                sha256,
                md5,
              },
              folderId,
            );

            const folderPath = path.join(config.FILE_PATH, folderId);
            const filePath = path.join(folderPath, newFile.fileId);
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fs.renameSync((file as any).path, filePath);

            // NOTE: upload file to cdn
            const responce = await FileHelper.uploadFile({
              filePath: path.join(folderId, newFile.fileId),
              CDNPath: path.join(folderId, `${newFile.fileId}.${newFile.ext}`),
              media: newFile.media,
            });
            if (!responce) ctx.throw(SERVER_ERROR.INTERNAL.status, SERVER_ERROR.INTERNAL.message);

            files.push(newFile);
          }
        }

        if (files.length > 0) {
          ctx.status = SUCCESS.OK.status;
          ctx.body = {
            folder,
            files,
          };
        } else {
          ctx.throw(SERVER_ERROR.INTERNAL.status, SERVER_ERROR.INTERNAL.message);
        }
      }
    } else {
      ctx.throw(
        StatusCodes.CLIENT_ERROR.BAD_REQUEST.status,
        StatusCodes.CLIENT_ERROR.BAD_REQUEST.message,
      );
    }
  },
); // {post} /file

router.get(
  '/',
  JWTGuard(),
  RoleGuard([UserRoleType.ADMIN]),
  ParamGuard(SearchSchema),
  async (ctx: ParameterizedContext) => {
    const files = await FileHelper.findAll(ctx.params);
    ctx.body = files;
  },
); // {get} /file/:id

router.get(
  '/me',
  JWTGuard(),
  RoleGuard([UserRoleType.USER]),
  HeaderGuard(FileDownloadSchema),
  ParamGuard(SearchSchema),
  async (ctx: ParameterizedContext) => {
    const files = await FileHelper.findByUserId(ctx.state.userId, ctx.params);
    ctx.body = files;
  },
); // {get} /file/:id

router.get(
  '/user/:id',
  JWTGuard(),
  RoleGuard([UserRoleType.ADMIN]),
  ParamGuard(IdSchema, { unknown: true }),
  ParamGuard(SearchSchema, { unknown: true }),
  async (ctx: ParameterizedContext) => {
    const files = await FileHelper.findByUserId(ctx.params.userId, ctx.params, true);
    ctx.body = files;
  },
); // {get} /file/:id

router.get(
  '/:id',
  JWTGuard({ passthrough: true }),
  ParamGuard(IdSchema),
  HeaderGuard(FileDownloadSchema),
  RoleGuard([UserRoleType.USER]),
  FolderGuard(),
  async (ctx: ParameterizedContext) => {
    const file = await FileHelper.findById(ctx.params.id);
    FileHelper.incrementViewCount(ctx.params.id);

    if (file) {
      const filePath = `/uploads/${path.join(`${file.folderId}`, `${ctx.params.id}.${file.ext}`)}`;
      const { token, expires } = await FileHelper.createToken({ filePath: filePath });
      ctx.body = {
        ...omit(file, ['password', 'deleted']),
        direct: { path: filePath, token, expires },
      };
    } else {
      ctx.throw(
        StatusCodes.CLIENT_ERROR.NOT_FOUND.status,
        StatusCodes.CLIENT_ERROR.NOT_FOUND.message,
      );
    }
  },
); // {get} /file/:id

export { router as FileController };
