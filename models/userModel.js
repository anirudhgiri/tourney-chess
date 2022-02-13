const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true
	},

	passwordHash: {
		type: String,
		required: true
	},

	passwordSalt: {
		type: String,
		required: true
	},

	joinDate: {
		type: Date,
		required: true
	}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
