const loginSchema = {
	username: { type: "string", min: 3, max: 20 },
	password: { type: "string", min: 6, max: 30 },
	$$strict: true,
};

module.exports = { loginSchema };
