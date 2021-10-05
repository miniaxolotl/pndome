import joi, { object } from "joi";

const UploadSchema = object({
	folderId: joi.string()
	.default(null),

	password: joi.string()
	.default(null)
	.min(3),

	protected: joi.boolean()
	.required(),
});

export default UploadSchema;