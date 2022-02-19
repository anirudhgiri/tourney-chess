const { Schema } = require("mongoose");
const {nanoid} = require("nanoid/non-secure");

const resultSchema = new Schema({
	_id: {type: String, default: ()=> nanoid(4)},
	colour: {type: String, required: true},
	opponentID: {type: String, required: true},
	points: {type: Number, required: true}
});

module.exports = {
	resultSchema,
};
