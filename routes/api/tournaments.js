const express = require("express");
const tournamentRouter = express.Router();

tournamentRouter.get("/", (req,res) => {
	res.json({success:true});
});

tournamentRouter.post("/createTournament", (req, res) => {
	res.json({success:true});
});

module.exports = tournamentRouter;

