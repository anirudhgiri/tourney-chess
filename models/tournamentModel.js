const { Schema, model } = require("mongoose");
const { playerSchema } = require("./playerModel");

const tournamentSchema = new Schema({
	tournamentID: {type: String, required: true},
	tournamentName: {type: String, required: true},
	tournamentCountry: {type: String, default: ""},
	tournamentFromDate: {type:Date, default: null},
	tournamentToDate: {type:Date, default: null},
	tournamentPlayers: {type: [playerSchema], default: []}
});

const tournamentModel = model("Tournament",tournamentSchema);

module.exports = {
	tournamentModel
};
