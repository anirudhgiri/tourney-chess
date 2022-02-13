const { Schema, model } = require("mongoose");
const { resultSchema } = require("./resultSchema");

const playerSchema = new Schema({
	playerID: {type: String, required: true},
	playerFirstName: {type: String, required: true},
	playerLastName: {type: String, required: true},
	playerFederation: {type: String, default: null},
	playerTitle: {type: String, default: null},
	playerElo: {type: Number, default: 0},
	playerStartingRank: {type: Number, default: 0},
	playerResults: {type: [resultSchema], default: []},
	playerScore: {type: Number, default: 0},
	playerColourBalance: {type: Number, default: 0},
	playerHasHadBye: {type: Boolean, default: false},
	playerHasFixedBoard: {type: Boolean, default:false},
	playerFixedBoardNumber: {type: Number, default: null},
	playerAvoidList: {type: [playerSchema], default: []}
});

const playerModel = model("Player",playerSchema);

module.exports = {
	playerSchema,
	playerModel
};
