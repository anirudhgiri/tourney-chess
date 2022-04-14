const { BodyValidator } = require("fastest-express-validator");

const errorHandler = (err, req, res) => {
	const { message } = err.body[0];
	res.status(422).json({ success: false, message });
};

const validationMiddleware = (schema) => BodyValidator(schema, errorHandler);

module.exports = { validationMiddleware };
