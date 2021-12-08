import { createReadStream } from 'fs';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { omit } from 'lodash';
import path from 'path';
import { uid } from 'uid/secure';

import { FileValues } from '@libs/shared';
import { db } from '@libs/database';

import config from '../../../../../../libs/config/src/server.config';
/**
 * create a new file
 * @param data file data to create
 * @returns database result
 */
const createFileList = (files: File | File[]) => {
  const fileList: File[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const group of Object.keys(files)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (files[group].length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const fGroup of files[group]) {
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
      fileList.push(files[group]);
    }
  }
  return fileList.length > 0 ? fileList : null;
};

/**
 * create a new file
 * @param data file data to create
 * @returns database result
 */
const createFile = async (data: FileValues, folderId: string) => {
  const fileId: string = uid(16);
  const result = await db.file.create({
    data: {
      fileId,
      name: data.name,
      media: data.type.search(/image|video|audio/) >= 0 ? true : false,
      type: data.type,
      ext: data.ext,
      bytes: data.bytes,
      sha256: data.sha256,
      md5: data.md5,
      folder: {
        connect: { folderId },
      },
    },
  });
  return result;
};

/**
 * upload file to cdn
 * @param data file data to create
 * @returns cdn responce
 */
const uploadFile = async ({ filePath, CDNPath, media }) => {
  const response = await fetch(
    `https://${media ? config.BUNNYCDN_API_MEDIA : config.BUNNYCDN_API}/uploads/${CDNPath}`,
    {
      method: 'PUT',
      headers: {
        AccessKey: media ? config.BUNNYCDN_API_MEDIA_KEY : config.BUNNYCDN_API_KEY,
      },
      body: createReadStream(path.join(config.FILE_PATH, filePath)),
    },
  );
  return response.status === 201;
};

/**
 * incement the download count of a file
 * @param fileId file data to create
 * @returns cdn responce
 */
const createToken = async ({ filePath }) => {
  const EXPIRE_DELTA = 1000 * 60 * 60; // 1 hour
  const tokenExpire = new Date().getTime() + EXPIRE_DELTA;
  const tokenBase = `${config.BUNNYCDN_TOKEN}${filePath}${tokenExpire}`;
  const tokenSHA256 = crypto.createHash('sha256').update(tokenBase).digest('hex');
  const tokenBase64 = Buffer.from(tokenSHA256, 'hex').toString('base64');
  const tokenSafe = tokenBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/, '');
  return {
    token: tokenSafe,
    expires: tokenExpire,
  };
};

/**
 * find a user by id
 * @param userId id of user to find
 * @returns database result
 */
const findAll = async ({ page, take }) => {
  const result = await db.file.findMany({ skip: take * (page ?? 0), take: take });
  return result.map((file) => omit(file, ['folder']));
};

/**
 * find a user by id
 * @param userId id of user to find
 * @returns database result
 */
const findByUserId = async (userId, { page, take }, deleted = false) => {
  const result = await db.file.findMany({
    skip: take * (page ?? 0),
    take: take,
    where: {
      folder: { users: { every: { userId } } },
      deleted: !deleted ? { equals: null } : { not: null },
    },
  });
  return result.map((file) => omit(file, ['folder']));
};

/**
 * find a user by id
 * @param userId id of user to find
 * @returns database result
 */
const findById = async (fileId) => {
  const result = await db.file.findUnique({
    where: { fileId },
  });
  return result;
};

/**
 * incement the view count of a file
 * @param fileId file data to create
 * @returns cdn responce
 */
const incrementViewCount = async (fileId) => {
  await db.file.update({
    where: { fileId },
    data: { vCount: { increment: 1 } },
  });
};

/**
 * incement the download count of a file
 * @param fileId file data to create
 * @returns cdn responce
 */
const incrementDownloadCount = async (fileId) => {
  await db.file.update({
    where: { fileId },
    data: { dCount: { increment: 1 } },
  });
};

export const FileHelper = {
  createFileList,
  createFile,
  uploadFile,
  createToken,
  findAll,
  findById,
  findByUserId,
  incrementViewCount,
  incrementDownloadCount,
};
