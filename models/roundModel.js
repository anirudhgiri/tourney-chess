const {Schema} = require("mongoose");
const {nanoid} = require("nanoid/non-secure");
const { gameSchema } = require("./gameModel");

const roundSchema = new Schema({
	id: {type: String, default: ()=> nanoid(4)},
	roundNumber: {type: Number, required: true},
	games: {type: [gameSchema], default: []}
});

module.exports = {
	roundSchema
};
