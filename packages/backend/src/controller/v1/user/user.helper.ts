import { PrismaClient } from '@prisma/client';
import { uid } from 'uid/secure';

import { UserValues } from '@lib/type';
import { genHash } from '@lib/util';
import { omit } from 'lodash';

const db = new PrismaClient();

/**
 * create a new user
 * @param data user data to create
 * @returns database result
 */
const create = async ({ username, email, password }: UserValues) => {
  const passwordHash: string = await genHash(password);
  const userId: string = uid(16);
  const result = await db.user.create({
    data: {
      userId,
      username,
      password: passwordHash,
      email,
      roles: { create: { roleId: 'user' } },
    },
  });
  return omit(result, ['password', 'deleted']);
};

/**
 * activate a user
 * @param userId id of user to activate
 * @returns database result
 */
export const activate = async (userId: string) => {
  const result = await db.user.update({ where: { userId }, data: { deleted: null } });
  return omit(result, ['password', 'deleted']);
};

/**
 * deactivate a user
 * @param userId id of user to deactivate
 * @returns database result
 */
export const deactivate = async (userId: string) => {
  const result = await db.user.update({ where: { userId }, data: { deleted: new Date() } });
  return omit(result, ['password', 'deleted']);
};

/**
 * add a role to a user
 * @param userId id of user to modify
 * @param roleId name of role to add to user
 * @returns database result
 */
export const addRole = async (userId: string, roleId: string) => {
  return db.userRole.createMany({ data: { userId, roleId } });
};

/**
 * delete a role from a user
 * @param userId id of user to modify
 * @param roleId name of role to delete from user
 * @returns database result
 */
export const deleteRole = async (userId: string, roleId: string) => {
  return db.userRole.delete({
    where: { roleId_userId: { userId, roleId } },
  });
};

/**
 * find a role on a user
 * @param userId id of user to find
 * @param roleId name of role to find
 * @returns database result
 */
export const hasRole = async (userId: string, roleId: string) => {
  return db.userRole.findFirst({ where: { userId, roleId } });
};

/**
 * find a user by id
 * @param userId id of user to find
 * @returns database result
 */
const findAll = async ({ page, take }) => {
  const result = await db.user.findMany({ skip: take * (page ?? 0), take: take });
  return result.map((user) => omit(user, ['password']));
};

/**
 * find a user by id
 * @param userId id of user to find
 * @returns database result
 */
const findById = async (userId: string) => {
  const result = await db.user.findUnique({ where: { userId } });
  return omit(result, ['password', 'deleted']);
};

/**
 * find a user by email or username
 * @param email email of user to find
 * @param username username of user to find
 * @returns database result
 */
const findByEmailOrUsername = async ({ email, username }) => {
  const result = await db.user.findFirst({ where: { OR: { email, username } } });
  return omit(result, ['password']);
};

/**
 * find a user by email
 * @param email email of user to find
 * @returns database result
 */
const findByEmail = async (email: string) => {
  const result = await db.user.findFirst({ where: { email } });
  return omit(result, ['password']);
};

/**
 * find a user by username
 * @param username username of user to find
 * @returns database result
 */
const findByUsername = async (username: string) => {
  const result = await db.user.findFirst({ where: { username } });
  return omit(result, ['password']);
};

export const UserHelper = {
  create,
  activate,
  deactivate,
  addRole,
  deleteRole,
  hasRole,
  findAll,
  findById,
  findByEmailOrUsername,
  findByEmail,
  findByUsername,
};
