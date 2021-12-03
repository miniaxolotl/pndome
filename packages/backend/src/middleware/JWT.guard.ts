import { CLIENT_ERROR } from '@lib/shared';
import { ParameterizedContext } from 'koa';
import jwt from 'jsonwebtoken';

import { config } from '../../../../server.config';

interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
  roles: string[];
}

export const JWTGuard = (options?: { passthrough?: boolean }) => {
  return async (ctx: ParameterizedContext, next: () => Promise<void>) => {
    const authorization = ctx.headers.authorization;
    if (authorization) {
      const authorization_key = authorization.split(' ')[1] ?? null;
      if (authorization_key) {
        const payload: JWTPayload = jwt.verify(authorization_key, config.JWT_SECRET) as JWTPayload;
        if (new Date(payload.exp) > new Date()) {
          ctx.state = payload;
          return await next();
        }
      }
    }

    if (options?.passthrough) return await next();
    else ctx.throw(CLIENT_ERROR.UNAUTHORIZED.status, CLIENT_ERROR.UNAUTHORIZED.message);
  };
};
