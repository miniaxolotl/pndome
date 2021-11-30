import { uid } from 'uid/secure';

import { FolderValues } from '@lib/type';
import { genHash } from '@lib/util';

import { db, generateFantasyName } from 'lib/src';

/**
 * create a new folder
 * @param data folder data to create
 * @returns database result
 */
const createFolder = async ({ userId, name, password, isProtected }: FolderValues) => {
  const folderId: string = uid(16);
  const result = await db.folder.create({
    data: {
      folderId,
      name: name ?? generateFantasyName(),
      password: password ? await genHash(password) : null,
      protected: isProtected,
      users: {
        create: userId ? { userId: userId, owner: true } : undefined,
      },
    },
  });
  return result;
};

/**
 * incement the view count of a file
 * @param folderId file data to create
 * @returns cdn responce
 */
const incrementViewCount = async (folderId) => {
  await db.folder.update({
    where: { folderId },
    data: { vCount: { increment: 1 } },
  });
};

/**
 * incement the download count of a file
 * @param fileId file data to create
 * @returns cdn responce
 */
const incrementDownloadCount = async (folderId) => {
  await db.folder.update({
    where: { folderId },
    data: { dCount: { increment: 1 } },
  });
};

export const FolderHelper = {
  createFolder,
  incrementViewCount,
  incrementDownloadCount,
};
