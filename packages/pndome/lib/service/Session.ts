import { PrismaClient } from ".prisma/client";
import Joi, { date } from "joi";
import { uid } from 'uid/secure';
import { validate, v4 as uuid } from 'uuid';

import { LoginSchema } from '../schema'
import { Bcrypt } from "../util";

export interface SessionType {
	sessionid?: string;
	userId?: string;
	username?: string;
	email?: string;
}

export interface LoginRequestType {
	username: string;
	password: string;
};

export const validateLoginRequest =
	(req: LoginRequestType): LoginRequestType | null => {
	const { value, error } = LoginSchema.validate(req, {
		abortEarly: false,
		errors: { escapeHtml: true }
	});
	if(error) {
		return null;
	} else {
		return value;
	}
};

export const createSession = async (db: PrismaClient, userId: string) => {
	const sessionId: string = uuid();
	return db.session.create({
		data: {
			sessionId: sessionId,
			userId: userId,
			expires: new Date(new Date().getTime() + (1000*60*60*24*30)),
		}
	});
};

export const revokeAllSession = async (db: PrismaClient, userId: string) => {
	return db.session.updateMany({
		where: {
			userId: userId,
		},
		data: {
			valid: false,
		}
	});
};

export const revokeSession = async (db: PrismaClient, sessionId: string) => {
	return db.session.update({
		where: {
			sessionId: sessionId,
		},
		data: {
			valid: false,
		}
	});
};

export const findUser = async (db: PrismaClient, username: string) => {
	return db.user.findFirst({
		where:{
			username: username
		}
	})
};