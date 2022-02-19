const { Schema, model } = require("mongoose");
const { playerSchema } = require("./playerModel");
const {nanoid} = require("nanoid");
const { roundSchema } = require("./roundModel");

const tournamentSchema = new Schema({
	_id: {type: String, default: ()=> nanoid(12)},
	privateId: {type: String, default: ()=> nanoid(4)},
	createdOn: {type:Date, default: ()=> Date.now()},
	owner: {type: String, required: true},
	name: {type: String, required: true, maxlength: 30},
	country: {type: String, default: ""},
	fromDate: {type:Date, default: null},
	toDate: {type:Date, default: null},
	players: {type: [playerSchema], default: []},
	rounds: {type: [roundSchema], default: [] },
	isPublic: {type: Boolean, default: false}
});

const tournamentModel = model("Tournament",tournamentSchema);

module.exports = {
	tournamentModel
};
