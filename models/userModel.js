const {Schema, model} = require("mongoose");
const {nanoid} = require("nanoid/non-secure");

function validateEmail(email) {
	// eslint-disable-next-line no-useless-escape
	let re = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return re.test(email);
}

const userSchema = new Schema({
	id: {type: String, default: ()=> nanoid(6)},
	username: {type: String, required: true, maxlength: 20},
	email: {type: String, required: true, validate: [validateEmail, "Invalid email address format"], maxlength:320},
	passwordHash: {type: String, required: true},
	passwordSalt: {type: String, required: true},
	joinDate: {type: Date, required: true},
	tournaments: {type: [String], default: []}
});

const User = model("User", userSchema);

module.exports = User;
