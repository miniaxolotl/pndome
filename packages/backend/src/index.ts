import Koa from 'koa';

import BodyParser from 'koa-bodyparser';
import CORS from '@koa/cors';
import KoaJSON from 'koa-json';
import KoaSession from 'koa-session';
import Router from 'koa-router';
import websockify from 'koa-websocket';

import { Prisma, PrismaClient } from '@prisma/client'

import { Session } from 'pndome';

import { config } from './lib/config';
import { FileController } from './controller';

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

(app.context as unknown as {
	db: PrismaClient<Prisma.PrismaClientOptions, never,
	Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>
}).db = new PrismaClient();
console.log("-connected successfully to database-");

/************************************************
	* middleware
	************************************************/

app.keys = config.sessionKeys;

app.use(KoaSession({
	key: 'session',
	maxAge: 1000*60*60*24*30,
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

(app.context as Koa.BaseContext & { state: Session.SessionType }).state = {
	session_id: null,
	user_id: null,
	email: null
};

/************************************************
	* routes
	************************************************/

{ /* api/v1 */
	const APIv1: Router = new Router();

	APIv1.use(['/f', '/file'], FileController.routes());

	router.use('/api/v1', APIv1.routes());
}
	
app.use(router.routes());

{ /* websocket */
	socket_router.all('/', async (ctx: any) => {
		ctx.websocket.send('Hello World');
	});
}

app.ws.use(socket_router.routes() as any);

/************************************************
	* start server
	************************************************/

app.listen(config.port, () => {
	// eslint-disable-next-line no-console
	console.log(`listening: http://localhost:${config.port}`);
	// eslint-disable-next-line no-console
	console.log(`enviroment: ${app.env}`);
});