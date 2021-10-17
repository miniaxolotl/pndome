import { PrismaClient } from ".prisma/client";
import Joi, { date } from "joi";
import { uid } from 'uid/secure';
import { validate, v4 as uuid } from 'uuid';

import { Bcrypt } from ".";
import { RegisterSchema } from "./schema";

export interface SessionType {
	sessionid?: string;
	userId?: string;
	username?: string;
	email?: string;
}

export interface RegisterRequstType {
	email: string;
	username: string;
	password: string;
};

export interface LoginRequstType {
	username: string;
	password: string;
};

export const validateRegisterRequest =
	(req: RegisterRequstType): RegisterRequstType | null => {
	const { value, error } = RegisterSchema.validate(req, {
		abortEarly: false,
		errors: { escapeHtml: true }
	});
	if(error) {
		return null;
	} else {
		return value;
	}
};

export const validateLoginRequest =
	(req: RegisterRequstType): RegisterRequstType | null => {
	const { value, error } = RegisterSchema.validate(req, {
		abortEarly: false,
		errors: { escapeHtml: true }
	});
	if(error) {
		return null;
	} else {
		return value;
	}
};

export const createUser = async (db: PrismaClient, user: RegisterRequstType) => {
	if(await findUser(db, user)) {
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

export const findUser = async (db: PrismaClient, payload: LoginRequstType) => {
	return db.user.findFirst({
		where:{
			username: payload.username
		}
	})
};