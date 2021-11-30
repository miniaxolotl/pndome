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
  incrementViewCount,
  incrementDownloadCount,
};
