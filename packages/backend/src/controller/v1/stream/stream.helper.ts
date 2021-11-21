import { uid } from 'uid/secure';
import fetch from 'node-fetch';
import path from 'path';

import { FileValues } from '@lib/type';

import { db } from 'lib/src';
import config from '../../../../../../server.config';
import { createReadStream } from 'fs';

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
      media: data.type.search(/image|video|audio/) > 0 ? true : false,
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
const uploadFile = async ({ filePath, CDNPath, contentType, media }) => {
  const response = await fetch(
    `https://${media ? config.BUNNYCDN_API_MEDIA : config.BUNNYCDN_API}/uploads/${CDNPath}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        AccessKey: media ? config.BUNNYCDN_API_MEDIA_KEY : config.BUNNYCDN_API_KEY,
      },
      body: createReadStream(path.join(config.FILE_PATH, filePath)),
    },
  );
  return response.status === 201;
};

/**
 * download file from cdn
 * @param data file data to create
 * @returns cdn responce
 */
const downloadFile = async ({ CDNPath, media }) => {
  const response = await fetch(
    `https://${media ? config.BUNNYCDN_API_MEDIA : config.BUNNYCDN_API}/uploads/${CDNPath}`,
    {
      method: 'GET',
      headers: {
        AccessKey: media ? config.BUNNYCDN_API_MEDIA_KEY : config.BUNNYCDN_API_KEY,
      },
    },
  );
  return response.body;
};

export const FileHelper = {
  createFile,
  uploadFile,
  downloadFile,
};
