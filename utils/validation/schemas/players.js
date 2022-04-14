const playersSchema = {
	firstname: { type: "string", min: 1, max: 20 },
	lastname: { type: "string", min: 1, max: 20 },
	federation: { type: "string", optional: true },
	title: { type: "string", optional: true },
	elo: { type: "number", optional: true },
	startingRank: { type: "number", optional: true },
	results: {
		type: "array",
		items: {
			type: "object",
			props: {
				colour: { type: "string" },
				opponentID: { type: "string" },
				points: { type: "number" },
			},
		},
		optional: true,
	},
	score: { type: "number", optional: true },
	colourBalance: { type: "number", optional: true },
	hasHadBye: { type: "boolean", optional: true },
	fixedBoardNumber: { type: "number", optional: true },
	avoidList: { type: "array", items: "string", optional: true },
	$$strict: true,
};

const addPlayersSchema = {
	players: {
		type: "array",
		items: { type: "object", params: playersSchema },
	},
	$$strict: true,
};

module.exports = { playersSchema, addPlayersSchema };
