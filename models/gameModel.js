const { Schema } = require("mongoose");
const {nanoid} = require("nanoid/non-secure");

const gameSchema = new Schema({
	_id: {type: String, default: ()=> nanoid(4)},
	whitePlayer: {type: String, required: true},
	blackPlayer: {type: String, required: true},
	result: {type: String, default: ""},
});

module.exports = {
	gameSchema
};
