const {DataTypes} = require("sequelize");
const { sequelize } = require("./postgres");

const userSchema = {
	username: {
		type: DataTypes.STRING,
		allowNull: false
	},

	email: {
		type: DataTypes.STRING,
		allowNull: false
	},

	passwordHash: {
		type: DataTypes.STRING,
		allowNull: false
	},

	passwordSalt: {
		type: DataTypes.STRING,
		allowNull: false
	}
};


const User = sequelize.define("users", userSchema);
sequelize.sync();

module.exports = User;
