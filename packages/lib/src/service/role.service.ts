import { PrismaClient, Prisma } from '.prisma/client';

export const findUserRoles = async (
  db: PrismaClient,
  username: string,
  include?: Prisma.UserRoleInclude,
) => {
  return db.userRole.findMany({
    where: {
      user: {
        OR: {
          userId: username,
          username: username,
        },
      },
    },
    include,
  });
};

export const findUserRolesById = async (
  db: PrismaClient,
  user_id: string,
  include?: Prisma.UserRoleInclude,
) => {
  return db.userRole.findMany({
    where: {
      user: {
        userId: user_id,
      },
    },
    include,
  });
};

export const findUserRolesByUsername = async (
  db: PrismaClient,
  username: string,
  include?: Prisma.UserRoleInclude,
) => {
  return db.userRole.findMany({
    where: {
      user: {
        username: username,
      },
    },
    include,
  });
};
