import { PrismaClient } from ".prisma/client";
import { uid } from "uid/secure";
import { Bcrypt } from "../packages/pndome/lib/util";

import config from '../server.config'

const db = new PrismaClient();

(async () => {
	try {
		console.log("-roles:")
		await db.role.createMany({
			data: [
				{
					"roleId": "admin",
				},
				{
					"roleId": "moderator",
				},
				{
					"roleId": "user",
				},
				{
					"roleId": "disabled",
				},
			]
		})
	console.log("fin")
	} catch {
		console.log("!!!err")
	}

	try {
		console.log("-user:")
		const passwordHash: string | null = await Bcrypt.genHash(config.ADMIN_PASS);
		await db.user.create({
			data: {
				userId: uid(16),
				email: config.ADMIN_EMAIL,
				username: config.ADMIN_USER,
				password: passwordHash,
				roles: {
					create: [{
						roleId: "admin"
					}, {
						roleId: "user"
					}]
				}
			}
		})
		console.log("fin")
	} catch {
		console.log("!!!err")
	}
	
	console.log("--COMPLETE--")
})();
