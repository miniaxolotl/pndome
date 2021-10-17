import { PrismaClient } from ".prisma/client";
import Joi, { date } from "joi";
import { uid } from 'uid/secure';
import { validate, v4 as uuid } from 'uuid';

import { Bcrypt } from "../util";
import { UserSchema } from "../schema";

export interface CreateUserRequestType {
	email: string;
	username: string;
	password: string;
};

export const validateCreateUserRequest =
	(req: CreateUserRequestType): CreateUserRequestType | null => {
	const { value, error } = UserSchema.validate(req, {
		abortEarly: false,
		errors: { escapeHtml: true }
	});
	if(error) {
		return null;
	} else {
		return value;
	}
};


export const createUser = async (db: PrismaClient, user: CreateUserRequestType) => {
	if(await findUser(db, user.username)) {
		return null;
	} else {
		const passwordHash: string | null = await Bcrypt.genHash(user.password);
		const userId: string = uid(16);
		return db.user.create({
			data: {
				userId: userId,
				username: user.username,
				password: passwordHash,
				email: user.email
			}
		});
	}
};

export const findUser = async (db: PrismaClient, username: string) => {
	return db.user.findFirst({
		where:{
			username: username
		}
	})
};