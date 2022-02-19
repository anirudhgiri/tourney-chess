const { Schema } = require("mongoose");
const { resultSchema } = require("./resultModel");
const {nanoid} = require("nanoid/non-secure");

const playerSchema = new Schema({
	_id: {type: String, default: ()=> nanoid(4)},
	firstName: {type: String, required: true, maxlength: 20},
	lastName: {type: String, required: true, maxlength: 20},
	federation: {type: String, default: null},
	title: {type: String, default: null},
	elo: {type: Number, default: 0},
	startingRank: {type: Number, default: 0},
	results: {type: [resultSchema], default: []},
	score: {type: Number, default: 0},
	colourBalance: {type: Number, default: 0},
	hasHadBye: {type: Boolean, default: false},
	hasFixedBoard: {type: Boolean, default:false},
	fixedBoardNumber: {type: Number, default: null},
});

playerSchema.add({avoidList: {type: [String], default: []}});

module.exports = {
	playerSchema,
};
