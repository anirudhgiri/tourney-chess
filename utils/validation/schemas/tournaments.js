const { playersSchema } = require("./players");

const gameSchema = {
	whitePlayer: { type: "string" },
	blackPlayer: { type: "string" },
	result: { type: "string", optional: true },
};

const roundSchema = {
	roundNumber: { type: "number" },
	games: { type: "array", items: { type: "object", props: gameSchema } },
};

const createTournamentSchema = {
	name: { type: "string", min: 1, max: 30 },
	country: { type: "string", optional: true },
	fromDate: { type: "date", optional: true },
	toDate: { type: "date", optional: true },
	players: {
		type: "array",
		items: { type: "object", props: playersSchema },
		optional: true,
	},
	rounds: {
		type: "array",
		items: { type: "object", props: roundSchema },
		optional: true,
	},
	isPublic: { type: "boolean", optional: true },
};

module.exports = { createTournamentSchema };
