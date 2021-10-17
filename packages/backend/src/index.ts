import Koa, { ParameterizedContext } from 'koa';

import BodyParser from 'koa-bodyparser';
import CORS from '@koa/cors';
import KoaJSON from 'koa-json';
import KoaSession from 'koa-session';
import Router from 'koa-router';
import websockify from 'koa-websocket';

import { PrismaClient } from '@prisma/client'

import { Session } from 'pndome/lib/service';

import { FileController, OAuthController, SessionController, UserController } from './controller';

import config from '../../../server.config'

/************************************************
	* setup
	************************************************/

const koaApp: Koa = new Koa();

const wsOptions = {};
const app = websockify(koaApp as any, wsOptions);

const router: Router = new Router();
const socket_router = new Router();

/************************************************
	* database
	************************************************/

(app.context as any).db = new PrismaClient();
if((app.context as any).db) {
	console.log("connected successfully to database");
}

/************************************************
	* middleware
	************************************************/

app.keys = config.SESSION_KEYS;

app.use(KoaSession({
	key: 'session',
	maxAge: 1000*60*60*24*30, // 30 days
	renew: true
}, app));

app.use(CORS({
	origin: '*',
	credentials: true
}));

app.use(KoaJSON({ pretty: false, param: 'pretty' }));

app.use(BodyParser());

/************************************************
	* authentication
	************************************************/

(app.context as Koa.BaseContext & { state: Session.SessionType }).state = {};

/************************************************
	* routes
	************************************************/

{ /* api/v1 */
	const API: Router = new Router();

	API.use(['/f', '/file'], FileController.routes());
	API.use(['/u', '/user'], UserController.routes());

	API.use(['/a', '/auth'], SessionController.routes());
	API.use(['/oa', '/oauth'], OAuthController.routes());

	router.use('/api/v1', API.routes());
}
	
app.use(router.routes());

{ /* websocket */
	socket_router.all('', async (ctx: ParameterizedContext) => {
		ctx.websocket.on('message', (message: string) => {
			message.localeCompare('ping') == 0 ? ctx.websocket.send('pong!') : null;
		});
	});
}

app.ws.use(socket_router.routes() as any);

/************************************************
	* start server
	************************************************/

app.listen(config.PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`listening: http://localhost:${config.PORT}`);
	// eslint-disable-next-line no-console
	console.log(`enviroment: ${app.env}`);
});