import Koa, { ParameterizedContext } from 'koa';

import BodyParser from 'koa-bodyparser';
import CORS from '@koa/cors';
import KoaJSON from 'koa-json';
import KoaSession from 'koa-session';
import Router from 'koa-router';
import websockify from 'koa-websocket';
import logger from 'koa-logger';

import config from '../../../server.config';

import {
  FileController,
  UserController,
  SessionController,
  JWTController,
  RoleController,
} from '.';
import { connectDB } from 'lib/src';

/************************************************
 * setup
 ************************************************/

const koaApp: Koa = new Koa();

const wsOptions = {};
const app = websockify(koaApp, wsOptions);

const router: Router = new Router();
const socket_router = new Router();

/************************************************
 * database
 ************************************************/

(async () => {
  await connectDB();
})();

/************************************************
 * middleware
 ************************************************/

app.keys = config.SESSION_KEYS;

app.use(
  KoaSession(
    {
      key: 'session',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      renew: true,
    },
    app,
  ),
);

app.use(
  CORS({
    origin: '*',
    credentials: true,
  }),
);

app.use(KoaJSON({ pretty: false, param: 'pretty' }));

app.use(BodyParser());

if (config.DEVELOPMENT) {
  app.use(logger());
}

/************************************************
 * authentication
 ************************************************/

/************************************************
 * routes
 ************************************************/

{
  /* api/v1 */
  const API: Router = new Router();

  API.use(['/f', '/file'], FileController.routes());
  API.use(['/r', '/role'], RoleController.routes());
  API.use(['/u', '/user'], UserController.routes());

  API.use(['/authenticate'], SessionController.routes());
  API.use(['/auth'], JWTController.routes());

  router.use('/api/v1', API.routes());
}

app.use(router.routes());

{
  /* websocket */
  socket_router.all('', async (ctx: ParameterizedContext) => {
    ctx.websocket.on('message', (message: string) => {
      message.localeCompare('ping') == 0 ? ctx.websocket.send('pong!') : null;
    });
  });
}

app.ws.use(socket_router.routes() as unknown as Koa.Middleware);

/************************************************
 * start server
 ************************************************/

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`listening: http://localhost:${config.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`enviroment: ${app.env}`);
});
