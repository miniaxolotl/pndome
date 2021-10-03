import { PrismaClient } from ".prisma/client";
import Joi, { date } from "joi";
import { validate } from "uuid";
import { RegisterSchema } from "./schema";

export interface SessionType {
	session_id?: string | null;
	user_id?: string | null;
	email?: string | null;
}

export interface RegisterRequst {
	username?: string;
	password?: string;
	email?: string;
};

export const findUser = async (db: PrismaClient, payload: RegisterRequst) => {
	return db.user.findFirst({
		where:{
			OR: [{
				username: payload.username
			}, {
				email: payload.email
			}]
		}
	})
};

export const validateRegister = (payload: RegisterRequst) => {
	const data = {
		username: validateUsername(payload.username),
		password: validatePassword(payload.password),
		email: validateEmail(payload.email),
		success: false,
	}

	data.success = data.username && data.password && data.email;
	
	return data;
};

export const validateUsername = (payload?: string) => {
	const { value, error } = RegisterSchema.validate({
		username: payload
	}, {
		errors: { escapeHtml: true }
	});
	
	if(error) {
		return null;
	} else {
		return value.username;
	}
};

export const validatePassword = (payload?: string) => {
	const { value, error } = RegisterSchema.validate({
		password: payload
	}, {
		errors: { escapeHtml: true }
	});

	if(error) {
		return null;
	} else {
		return value.password;
	}
};

export const validateEmail = (payload?: string) => {
	const { value, error } = RegisterSchema.validate({
		email: payload
	}, {
		errors: { escapeHtml: true }
	});

	if(error) {
		return null;
	} else {
		return value.email;
	}
};