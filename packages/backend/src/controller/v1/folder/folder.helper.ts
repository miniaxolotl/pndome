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
 * find a user by id
 * @param userId id of user to find
 * @returns database result
 */
const findByUserId = async (userId, { page, take }, deleted = false) => {
  const result = await db.folder.findMany({
    skip: take * (page ?? 0),
    take: take,
    where: {
      users: { every: { userId } },
      deleted: !deleted ? { equals: null } : { not: null },
    },
  });
  return result.map((folder) => ({ ...folder, password: !!folder.password }));
};

/**
 * deactivate a user
 * @param userId id of user to deactivate
 * @returns database result
 */
export const patchFolder = async (folderId: string, data) => {
  const result = await db.folder.update({
    where: { folderId },
    data: {
      ...data,
      password: data.password ? await genHash(data.password) : null,
    },
  });
  return result;
};

/**
 * deactivate a user
 * @param userId id of user to deactivate
 * @returns database result
 */
export const deleteFolder = async (folderId: string) => {
  const result = await db.folder.update({ where: { folderId }, data: { deleted: new Date() } });
  return result;
};

/**
 * deactivate a user
 * @param userId id of user to deactivate
 * @returns database result
 */
export const addUserAccess = async (folderId: string, userId: string) => {
  const result = await db.userFolder.create({ data: { folderId, userId } });
  return result;
};

/**
 * deactivate a user
 * @param userId id of user to deactivate
 * @returns database result
 */
export const revokeUserAccess = async (folderId: string, userId: string) => {
  const result = await db.userFolder.update({
    where: { userId_folderId: { folderId, userId } },
    data: { access: false },
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
  findByUserId,
  patchFolder,
  deleteFolder,
  addUserAccess,
  revokeUserAccess,
  incrementViewCount,
  incrementDownloadCount,
};
