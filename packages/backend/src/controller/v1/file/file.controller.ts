import { JWTGuard, SchemaGuard } from '@backend/middleware';
import { RoleGuard } from '@backend/middleware/role.guard';
import { FileUploadSchema } from '@lib/schema';
import { SERVER_ERROR, StatusCodes, SUCCESS, UserRoleType } from '@lib/shared';
import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import FileType from 'file-type';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import config from '../../../../../../server.config';
import { Folder } from '.prisma/client';
import { genHash } from '@lib/util';
import { db } from '@lib/db';
import { FolderHelper } from '../folder';
import { FileHelper } from './file.helper';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.all(
  '/',
  JWTGuard({ passthrough: true }),
  RoleGuard([UserRoleType.USER], { passthrough: true }),
  SchemaGuard(FileUploadSchema),
  async (ctx: ParameterizedContext) => {
    const fileList: File[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const group of Object.keys((ctx.request as any).files)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((ctx.request as any).files[group].length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const fGroup of (ctx.request as any).files[group]) {
          if (fGroup.length > 0) {
            fGroup.forEach((file: File) => {
              fileList.push(file);
            });
          } else {
            fileList.push(fGroup);
          }
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fileList.push((ctx.request as any).files[group]);
      }
    }

    const data = ctx.data;

    // const fileList: File[] =
    //   userFiles && (userFiles as File[]).length
    //     ? (userFiles as File[])
    //     : userFiles
    //     ? [userFiles as File]
    //     : [];

    if (fileList.length > 0) {
      let folder: Folder | null;

      // NOTE: create folder
      if (data.folderId) {
        folder = await db.folder.findUnique({ where: { folderId: data.folderId } });
      } else {
        folder = await FolderHelper.createFolder({
          password: data.password ? await genHash(data.password) : null,
          isProtected: data.protected && ctx.state.userId ? true : false,
        });
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

            if (
              !(await FileHelper.uploadFile({
                filePath: path.join(folderId, newFile.fileId),
                CDNPath: path.join(folderId, `${newFile.fileId}.${newFile.ext}`),
                contentType: newFile.type,
                media: newFile.media,
              }))
            ) {
              ctx.throw(SERVER_ERROR.INTERNAL.status, SERVER_ERROR.INTERNAL.message);
            }

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

export { router as FileController };
