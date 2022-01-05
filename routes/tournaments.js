const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("tournaments",{tourneyPage: true, title:"Tournaments - TourneyChess"});
});

module.exports = router;
