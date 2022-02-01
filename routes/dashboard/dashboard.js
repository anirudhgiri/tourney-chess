const express = require("express");
const dashboardRouter =  express.Router();
const homeRouter = require("./home");
const tournamentRouter = require("./tournaments");
dashboardRouter.get("*", (req,res,next) => {
	console.log(req.sesssion);
	if(req.session.username)
		next();
	else
		res.redirect("/api/login");
});

dashboardRouter.use("/home", homeRouter);
dashboardRouter.use("/tournaments", tournamentRouter);

module.exports = dashboardRouter;
