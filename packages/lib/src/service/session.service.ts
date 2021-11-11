import {
  PrismaClient,
  User as UserModel,
  Session as SessionModel,
  UserRole as UserRoleModel,
  Prisma,
} from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { LoginSchema } from '../schema';

export interface UserSessionType {
  user: UserModel | null;
  session: SessionModel | null;
  roles?: UserRoleModel[] | null;
}

export interface LoginRequestType {
  username: string;
  password: string;
}

export const validateLoginRequest = (req: LoginRequestType): LoginRequestType | null => {
  const { value, error } = LoginSchema.validate(req, {
    abortEarly: false,
    errors: { escapeHtml: true },
  });
  if (error) {
    return null;
  } else {
    return value;
  }
};

export const createSession = async (
  db: PrismaClient,
  userId: string,
  include?: Prisma.SessionInclude,
) => {
  const sessionId: string = uuid();
  return db.session.create({
    data: {
      sessionId: sessionId,
      userId: userId,
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
    },
    include,
  });
};

export const revokeAllSession = async (db: PrismaClient, userId: string) => {
  return db.session.updateMany({
    where: {
      userId: userId,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeSession = async (
  db: PrismaClient,
  sessionId: string,
  include?: Prisma.SessionInclude,
) => {
  return db.session.update({
    where: {
      sessionId: sessionId,
    },
    data: {
      revoked: true,
    },
    include,
  });
};
