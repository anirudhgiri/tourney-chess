const express = require("express");
const { tournamentModel } = require("../../models/tournamentModel");
const { addPlayersSchema } = require("../../utils/validation/schemas/players");
const playerRouter = express.Router({ mergeParams: true });
const {
	validationMiddleware,
} = require("../../utils/validation/validationMiddleware");

playerRouter.post(
	"/",
	validationMiddleware(addPlayersSchema),
	async (req, res) => {
		const tournament = await tournamentModel.findOne({
			privateId: req.params.privateId,
		});
		if (!tournament)
			res.status(404).json({
				success: false,
				message: `Tournament with tournamentId '${req.params.privateId}' not found`,
			});
		else if (req.session.userId !== tournament.owner)
			res.status(403).json({
				success: false,
				message: "You are not the owner of this tournament",
			});
		else {
			tournament.players = [...tournament.players, ...req.body.players];
			await tournament.save();
			res.status(200).json({ success: true, message: tournament });
		}
	}
);

playerRouter.put("/:playerId", async (req, res) => {
	const tournament = await tournamentModel.findOne({
		privateId: req.params.privateId,
	});
	if (!tournament)
		res.status(404).json({
			success: false,
			message: `Tournament with tournamentId '${req.params.privateId}' not found`,
		});

	for (const key in req.body)
		if (key in tournament) tournament[key] = req.body[key];

	await tournament.save();
	res.status(200).json({ success: true, message: tournament });
});

module.exports = playerRouter;
