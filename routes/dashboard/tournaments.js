const express = require("express");
const tournamentsRouter = express.Router();

tournamentsRouter.get("/", (req, res) => {
	res.render("tournaments",{tourneyPage: true, title:"Tournaments - TourneyChess", topbarText: "My Tournaments"});
});

module.exports = tournamentsRouter;
