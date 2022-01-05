const express = require("express");
const router = express.Router();

router.get("/", (req, res)=> {
	res.render("home", {homePage: true, title: "TourneyChess - Free Online Chess Tournament Manager" });
});

module.exports = router;
