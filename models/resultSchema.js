const { Schema, model } = require("mongoose");

const resultSchema = new Schema({
	playerColour: {type: String, required: true},
	opponentID: {type: String, required: true},
	playerResult: {type: Number, required: true}
});

const resultModel = model(resultSchema);

module.exports = {
	resultSchema,
	resultModel
};
