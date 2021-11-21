import { uid } from 'uid/secure';

import { FolderValues } from '@lib/type';
import { genHash } from '@lib/util';

import { db, generateFantasyName } from 'lib/src';

/**
 * create a new folder
 * @param data folder data to create
 * @returns database result
 */
const createFolder = async ({ name, password, isProtected }: FolderValues) => {
  const folderId: string = uid(16);
  const result = await db.folder.create({
    data: {
      folderId,
      name: name ?? generateFantasyName(),
      password: password ? await genHash(password) : null,
      protected: isProtected,
    },
  });
  return result;
};

export const FolderHelper = {
  createFolder,
};
