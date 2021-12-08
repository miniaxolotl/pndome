import { db } from '@libs/database';

/**
 * show all roles
 * @returns database result
 */
const findAll = async ({ page, take }) => {
  const result = await db.role.findMany({
    skip: take * (page ?? 0),
    take: take,
    orderBy: { authority: 'asc' },
  });
  return result;
};

export const RoleHelper = {
  findAll,
};
