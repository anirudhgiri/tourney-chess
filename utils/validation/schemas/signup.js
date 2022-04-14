const signUpSchema = {
	username: { type: "string", min: 3, max: 20 },
	email: { type: "email" },
	password: { type: "string", min: 6, max: 30 },
	$$strict: true,
};

module.exports = { signUpSchema };
