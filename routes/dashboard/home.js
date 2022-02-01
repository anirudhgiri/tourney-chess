const express = require("express");
const homeRouter = express.Router();

homeRouter.get("/", (req, res)=> {
	res.render("home", {homePage: true, title: "TourneyChess - Free Online Chess Tournament Manager", topbarText: "TourneyChess - Free Online Chess Tournament Manager" });
});

module.exports = homeRouter;
