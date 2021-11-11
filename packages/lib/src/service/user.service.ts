import { PrismaClient, Prisma } from '.prisma/client';
import { uid } from 'uid/secure';

import { Bcrypt } from '../util';
import { UserSchema } from '../schema';

export interface CreateUserRequestType {
  email: string;
  username: string;
  password: string;
}

export const validateCreateUserRequest = (
  req: CreateUserRequestType,
): CreateUserRequestType | null => {
  const { value, error } = UserSchema.validate(req, {
    abortEarly: false,
    errors: { escapeHtml: true },
  });
  if (error) {
    return null;
  } else {
    return value;
  }
};

export const createUser = async (
  db: PrismaClient,
  user: CreateUserRequestType,
  include?: Prisma.UserInclude,
) => {
  if (await findUserByUsername(db, user.username)) {
    return null;
  } else {
    const passwordHash: string | null = await Bcrypt.genHash(user.password);
    const userId: string = uid(16);
    return db.user.create({
      data: {
        userId: userId,
        username: user.username,
        password: passwordHash,
        email: user.email,
        roles: {
          create: {
            roleId: 'user',
          },
        },
      },
      include,
    });
  }
};

export const addUserRole = async (db: PrismaClient, userId: string, role: string) => {
  if (await findUserById(db, userId)) {
    return null;
  } else {
    return db.userRole.create({
      data: {
        userId: userId,
        roleId: role,
      },
    });
  }
};

export const deleteUser = async (
  db: PrismaClient,
  userId: string,
  include?: Prisma.UserInclude,
) => {
  if (!(await findUserById(db, userId))) {
    return null;
  } else {
    return db.user.update({
      data: {
        username: `deleted_user_${userId}`,
        password: '',
        email: `deleted_user_${userId}`,
      },
      where: {
        userId: userId,
      },
      include,
    });
  }
};

export const enableUser = async (
  db: PrismaClient,
  userId: string,
  include?: Prisma.UserRoleInclude,
) => {
  if (await findUserById(db, userId)) {
    return null;
  } else {
    return db.userRole.delete({
      where: {
        roleId_userId: {
          roleId: 'disabled',
          userId: userId,
        },
      },
      include,
    });
  }
};

export const disableUser = async (db: PrismaClient, userId: string) => {
  if (await findUserById(db, userId)) {
    return null;
  } else {
    return addUserRole(db, userId, 'disabled');
  }
};

export const findUserById = async (
  db: PrismaClient,
  userId: string,
  include?: Prisma.UserInclude,
) => {
  return db.user.findFirst({
    where: {
      userId: userId,
    },
    include,
  });
};

export const findUserByUsername = async (
  db: PrismaClient,
  username: string,
  include?: Prisma.UserInclude,
) => {
  return db.user.findUnique({
    where: {
      username: username,
    },
    include: {
      roles: true,
      ...include,
    },
  });
};
