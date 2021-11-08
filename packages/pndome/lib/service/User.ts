import { PrismaClient } from ".prisma/client";
import Joi, { date } from "joi";
import { uid } from "uid/secure";
import { validate, v4 as uuid } from "uuid";

import { Bcrypt } from "../util";
import { UserSchema } from "../schema";

export interface CreateUserRequestType {
  email: string;
  username: string;
  password: string;
}

export const validateCreateUserRequest = (
  req: CreateUserRequestType
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
  user: CreateUserRequestType
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
            roleId: "user",
          },
        },
      },
    });
  }
};

export const createUserRole = async (
  db: PrismaClient,
  userId: string,
  role: string
) => {
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

export const disableUser = async (db: PrismaClient, userId: string) => {
  if (await findUserById(db, userId)) {
    console.log(await findUserById(db, userId));
    console.log(123);

    return null;
  } else {
    return createUserRole(db, userId, "disabled");
  }
};

export const enableUser = async (db: PrismaClient, userId: string) => {
  if (await findUserById(db, userId)) {
    return null;
  } else {
    return db.userRole.delete({
      where: {
        roleId_userId: {
          roleId: "disabled",
          userId: userId,
        },
      },
    });
  }
};

export const deleteUser = async (db: PrismaClient, userId: string) => {
  if (!(await findUserById(db, userId))) {
    return null;
  } else {
    return db.user.update({
      data: {
        username: `deleted_user_${userId}`,
        password: "",
        email: `deleted_user_${userId}`,
      },
      where: {
        userId: userId,
      },
    });
  }
};

export const findUserById = async (db: PrismaClient, userId: string) => {
  return db.user.findFirst({
    where: {
      userId: userId,
    },
  });
};

export const findUserByUsername = async (
  db: PrismaClient,
  username: string
) => {
  return db.user.findFirst({
    where: {
      username: username,
    },
  });
};

export const findRoles = async (db: PrismaClient, username: string) => {
  return db.userRole.findMany({
    select: {
      roleId: true,
    },
    where: {
      user: {
        OR: {
          userId: username,
          username: username,
        },
      },
    },
  });
};
